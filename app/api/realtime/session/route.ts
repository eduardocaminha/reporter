import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/realtime/session
 *
 * Creates an ephemeral client secret for the OpenAI Realtime API
 * (transcription-only mode). The browser uses this token to establish
 * a WebRTC peer connection directly with OpenAI.
 *
 * Body: { language: "pt" | "en" | "es" }
 * Returns: { clientSecret: string }
 */

/* ------------------------------------------------------------------ */
/*  Medical glossary prompt per language                               */
/*                                                                    */
/*  Sent as `prompt` inside the transcription config to bias the      */
/*  model towards correct medical terminology, measurement formats,   */
/*  and abbreviations common in radiology dictation.                  */
/*                                                                    */
/*  Keep each prompt ≤ ~500 tokens — enough to anchor vocabulary      */
/*  without wasting context window.                                   */
/* ------------------------------------------------------------------ */

const MEDICAL_PROMPTS: Record<string, string> = {
  // MAX 1024 characters per prompt (OpenAI limit)
  pt: [
    "apendicite, diverticulite, pneumoperitônio, abscesso, colecistite,",
    "colelitíase, coledocolitíase, hepatoesplenomegalia, esteatose hepática,",
    "linfadenopatia, derrame pleural, atelectasia, consolidação,",
    "pneumotórax, hemotórax, TEP, AVC isquêmico, AVC hemorrágico,",
    "hematoma subdural, hematoma epidural, hemorragia subaracnóidea, HSA,",
    "hidrocefalia, edema cerebral, desvio de linha média, herniação,",
    "espondilolistese, protrusão discal, extrusão discal, estenose de canal,",
    "fratura, luxação, nódulo, cisto, massa, lesão focal,",
    "realce heterogêneo, realce homogêneo, realce anelar,",
    "Medidas: 1,2 cm, 0,5 cm, 3,4 mm. TC, RM, US, RX.",
    "achados, impressão diagnóstica, conclusão, correlação clínica,",
    "controle evolutivo, sem alterações significativas.",
  ].join(" "),

  en: [
    "appendicitis, diverticulitis, pneumoperitoneum, abscess, cholecystitis,",
    "cholelithiasis, hepatosplenomegaly, hepatic steatosis,",
    "lymphadenopathy, pleural effusion, atelectasis, consolidation,",
    "pneumothorax, hemothorax, pulmonary thromboembolism, PE,",
    "ischemic stroke, hemorrhagic stroke, subdural hematoma, epidural hematoma,",
    "subarachnoid hemorrhage, SAH, hydrocephalus, cerebral edema, midline shift,",
    "spondylolisthesis, disc protrusion, disc extrusion, spinal stenosis,",
    "fracture, dislocation, nodule, cyst, mass, focal lesion,",
    "heterogeneous enhancement, homogeneous enhancement, rim enhancement,",
    "Measurements: 1.2 cm, 0.5 cm, 3.4 mm.",
    "findings, impression, conclusion, clinical correlation, follow-up,",
    "no significant abnormality, within normal limits.",
  ].join(" "),

  es: [
    "apendicitis, diverticulitis, neumoperitoneo, absceso, colecistitis,",
    "colelitiasis, hepatoesplenomegalia, esteatosis hepática,",
    "linfadenopatía, derrame pleural, atelectasia, consolidación,",
    "neumotórax, hemotórax, tromboembolismo pulmonar, TEP,",
    "ACV isquémico, ACV hemorrágico, hematoma subdural, hematoma epidural,",
    "hemorragia subaracnoidea, HSA, hidrocefalia, edema cerebral,",
    "espondilolistesis, protrusión discal, extrusión discal, estenosis de canal,",
    "fractura, luxación, nódulo, quiste, masa, lesión focal,",
    "realce heterogéneo, realce homogéneo,",
    "Medidas: 1,2 cm, 0,5 cm, 3,4 mm.",
    "hallazgos, impresión diagnóstica, conclusión, correlación clínica,",
    "control evolutivo, sin alteraciones significativas.",
  ].join(" "),
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured" },
      { status: 500 },
    )
  }

  try {
    const { language = "pt" } = await req.json()

    const prompt = MEDICAL_PROMPTS[language] ?? MEDICAL_PROMPTS.pt

    // ----------------------------------------------------------------
    // Transcription-only session via the Realtime API.
    // Docs: https://developers.openai.com/api/docs/guides/realtime-transcription
    //
    // session.type = "transcription" → no model responses, STT only.
    // The transcription model is inside audio.input.transcription.model.
    // ----------------------------------------------------------------
    const response = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: {
            type: "transcription",
            audio: {
              input: {
                noise_reduction: { type: "near_field" },
                transcription: {
                  model: "gpt-4o-transcribe",
                  language,
                  prompt,
                },
                turn_detection: {
                  type: "server_vad",
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  // Higher silence tolerance — radiologists often pause
                  // mid-sentence to think. 500ms was too aggressive and
                  // split turns prematurely. 1500ms lets them breathe
                  // without losing streaming feedback.
                  silence_duration_ms: 1500,
                },
              },
            },
          },
        }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenAI Realtime API error:", response.status, errorText)
      return NextResponse.json(
        { error: `OpenAI API error: ${response.status}`, detail: errorText },
        { status: response.status },
      )
    }

    const data = await response.json()

    // The docs browser example reads `data.value` directly.
    // The API reference shows `data.client_secret.value`. Handle both.
    const token =
      data?.client_secret?.value ?? data?.value ?? null
    if (!token) {
      console.error("Unexpected response shape:", JSON.stringify(data))
      return NextResponse.json(
        { error: "No client secret in response" },
        { status: 500 },
      )
    }

    return NextResponse.json({ clientSecret: token })
  } catch (error) {
    console.error("Realtime session error:", error)
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 },
    )
  }
}
