"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Database, Mail, Shield, Globe } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"

type SiteSettings = {
  site_name: string
  site_description: string
  contact_email: string
  maintenance_mode: boolean
  analytics_enabled: boolean
  newsletter_enabled: boolean
}

export default function SettingsClient() {
  const { user, fetchWithAuth } = useAuth()
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: "IA pour PME",
    site_description: "Votre guide pour intégrer l'IA dans votre PME",
    contact_email: "contact@iapourpme.com",
    maintenance_mode: false,
    analytics_enabled: true,
    newsletter_enabled: true,
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    try {
      setLoading(true)
      const response = await fetchWithAuth("/api/dashboard/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
            <p className="text-muted-foreground">Configurez les paramètres de votre site et de l'administration</p>
          </div>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Sauvegarde..." : saved ? "Sauvegardé ✓" : "Sauvegarder"}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">
              <Globe className="mr-2 h-4 w-4" />
              Général
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="database">
              <Database className="mr-2 h-4 w-4" />
              Base de données
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du Site</CardTitle>
                <CardDescription>Configurez les informations générales de votre site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site_name">Nom du Site</Label>
                    <Input
                      id="site_name"
                      value={settings.site_name}
                      onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site_description">Description</Label>
                    <Textarea
                      id="site_description"
                      value={settings.site_description}
                      onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Email de Contact</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={settings.contact_email}
                      onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fonctionnalités</CardTitle>
                <CardDescription>Activez ou désactivez les fonctionnalités du site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mode Maintenance</Label>
                    <p className="text-sm text-muted-foreground">Désactive temporairement l'accès public au site</p>
                  </div>
                  <Switch
                    checked={settings.maintenance_mode}
                    onCheckedChange={(checked) => setSettings({ ...settings, maintenance_mode: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analytics</Label>
                    <p className="text-sm text-muted-foreground">Collecte des données d'utilisation du site</p>
                  </div>
                  <Switch
                    checked={settings.analytics_enabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, analytics_enabled: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Newsletter</Label>
                    <p className="text-sm text-muted-foreground">Permet aux visiteurs de s'abonner à la newsletter</p>
                  </div>
                  <Switch
                    checked={settings.newsletter_enabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, newsletter_enabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Email</CardTitle>
                <CardDescription>Paramètres pour l'envoi d'emails et la newsletter</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>MailerLite API Key</Label>
                    <Input type="password" placeholder="Votre clé API MailerLite" />
                    <p className="text-sm text-muted-foreground">Configurée via les variables d'environnement</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Email d'expédition</Label>
                    <Input value="noreply@iapourpme.com" disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>Paramètres de sécurité et d'authentification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Utilisateur Connecté</Label>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <Badge variant="default">Administrateur</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>Changer le Mot de Passe</Label>
                    <Button variant="outline">Modifier le Mot de Passe</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Base de Données</CardTitle>
                <CardDescription>Informations et maintenance de la base de données</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Statut de la Connexion</Label>
                    <Badge variant="default">Connectée</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>Type de Base</Label>
                    <p className="text-sm">PostgreSQL (Supabase)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Actions de Maintenance</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Optimiser les Tables
                    </Button>
                    <Button variant="outline" size="sm">
                      Nettoyer les Logs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
