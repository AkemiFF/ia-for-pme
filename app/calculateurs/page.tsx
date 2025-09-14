import ROICalculator from "@/components/calculators/ROICalculator"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Calculateurs ROI IA | Estimez vos gains de productivité",
  description:
    "Calculez précisément le retour sur investissement des outils IA pour freelances, PME et e-commerce. Estimations personnalisées et méthodologie transparente.",
  keywords:
    "calculateur ROI IA, retour investissement intelligence artificielle, gains productivité IA, outils IA PME freelance",
}

export default function CalculateursPage() {
  return <ROICalculator />
}
