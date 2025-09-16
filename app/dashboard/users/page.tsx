import type { Metadata } from "next"
import UsersManagementClient from "./UsersManagementClient"

export const metadata: Metadata = {
  title: "Gestion des Utilisateurs - Admin IA pour PME",
  description: "Interface de gestion des utilisateurs pour l'administration",
  robots: "noindex, nofollow",
}

export default function UsersManagementPage() {
  return <UsersManagementClient />
}
