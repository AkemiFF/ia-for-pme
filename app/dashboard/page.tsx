import type { Metadata } from "next"
import DashboardClient from "./DashboardClient"

export const metadata: Metadata = {
  title: "Dashboard - IA pour PME",
  description: "Interface d'administration pour gérer le contenu",
}

export default function DashboardPage() {
  return <DashboardClient key="dashboard-main" />
}
