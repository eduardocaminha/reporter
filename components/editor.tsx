'use client';

import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from "next-intl"

interface EditorProps {
  valor: string;
  onChange: (valor: string) => void;
  disabled?: boolean;
}

export function Editor({ valor, onChange, disabled }: EditorProps) {
  const t = useTranslations("Editor")

  return (
    <Textarea
      placeholder={t("placeholder")}
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="min-h-[200px] bg-input/50 border-border/50 text-foreground placeholder:text-muted-foreground/40 resize-none"
    />
  );
}
