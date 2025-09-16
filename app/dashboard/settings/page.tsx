import type { Metadata } from "next"
import SettingsClient from "./SettingsClient"

export const metadata: Metadata = {
  title: "Paramètres - Admin IA pour PME",
  description: "Interface de paramètres pour l'administration",
  robots: "noindex, nofollow",
}

export default function SettingsPage() {
  return <SettingsClient />
}
