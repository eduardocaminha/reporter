import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { getTranslations } from "next-intl/server"

export async function POST(request: Request) {
  const t = await getTranslations("Api")
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: t("noFile") }, { status: 400 })
    }

    const blob = await put(`landing/${file.name}`, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: t("uploadError") },
      { status: 500 }
    )
  }
}
