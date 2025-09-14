"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, TrendingUp, Clock, DollarSign, Users, Zap } from "lucide-react"

interface ROIResult {
  monthlyGains: number
  yearlyGains: number
  timeSaved: number
  paybackPeriod: number
  roi: number
}

export default function ROICalculator() {
  const [activeTab, setActiveTab] = useState("freelance")

  // Freelance Calculator State
  const [freelanceData, setFreelanceData] = useState({
    hourlyRate: 50,
    hoursPerWeek: 40,
    toolCost: 100,
    timeSavedPercent: 30,
    qualityImprovement: 20,
  })

  // PME Calculator State
  const [pmeData, setPmeData] = useState({
    employees: 5,
    averageSalary: 3500,
    toolCostPerUser: 50,
    productivityGain: 25,
    customerSatisfaction: 15,
  })

  // E-commerce Calculator State
  const [ecommerceData, setEcommerceData] = useState({
    monthlyRevenue: 10000,
    conversionRate: 2.5,
    averageOrderValue: 75,
    toolCost: 200,
    conversionImprovement: 20,
    automationSavings: 15,
  })

  const [freelanceROI, setFreelanceROI] = useState<ROIResult | null>(null)
  const [pmeROI, setPmeROI] = useState<ROIResult | null>(null)
  const [ecommerceROI, setEcommerceROI] = useState<ROIResult | null>(null)

  // Freelance ROI Calculation
  useEffect(() => {
    const monthlyHours = freelanceData.hoursPerWeek * 4.33
    const monthlyRevenue = monthlyHours * freelanceData.hourlyRate
    const timeSavedHours = monthlyHours * (freelanceData.timeSavedPercent / 100)
    const additionalRevenue = timeSavedHours * freelanceData.hourlyRate
    const qualityBonus = monthlyRevenue * (freelanceData.qualityImprovement / 100)
    const monthlyGains = additionalRevenue + qualityBonus - freelanceData.toolCost

    setFreelanceROI({
      monthlyGains,
      yearlyGains: monthlyGains * 12,
      timeSaved: timeSavedHours,
      paybackPeriod: freelanceData.toolCost / (additionalRevenue + qualityBonus),
      roi: ((monthlyGains * 12) / (freelanceData.toolCost * 12)) * 100,
    })
  }, [freelanceData])

  // PME ROI Calculation
  useEffect(() => {
    const monthlySalaryCost = pmeData.employees * pmeData.averageSalary
    const monthlyToolCost = pmeData.employees * pmeData.toolCostPerUser
    const productivityGains = monthlySalaryCost * (pmeData.productivityGain / 100)
    const customerValue = monthlySalaryCost * (pmeData.customerSatisfaction / 100) * 0.5
    const monthlyGains = productivityGains + customerValue - monthlyToolCost

    setPmeROI({
      monthlyGains,
      yearlyGains: monthlyGains * 12,
      timeSaved: pmeData.employees * 40 * 4.33 * (pmeData.productivityGain / 100),
      paybackPeriod: monthlyToolCost / (productivityGains + customerValue),
      roi: ((monthlyGains * 12) / (monthlyToolCost * 12)) * 100,
    })
  }, [pmeData])

  // E-commerce ROI Calculation
  useEffect(() => {
    const currentOrders = ecommerceData.monthlyRevenue / ecommerceData.averageOrderValue
    const newConversionRate = ecommerceData.conversionRate * (1 + ecommerceData.conversionImprovement / 100)
    const additionalOrders = (currentOrders / ecommerceData.conversionRate) * newConversionRate - currentOrders
    const additionalRevenue = additionalOrders * ecommerceData.averageOrderValue
    const automationSavings = ecommerceData.monthlyRevenue * (ecommerceData.automationSavings / 100)
    const monthlyGains = additionalRevenue + automationSavings - ecommerceData.toolCost

    setEcommerceROI({
      monthlyGains,
      yearlyGains: monthlyGains * 12,
      timeSaved: 40, // Estimation heures économisées
      paybackPeriod: ecommerceData.toolCost / (additionalRevenue + automationSavings),
      roi: ((monthlyGains * 12) / (ecommerceData.toolCost * 12)) * 100,
    })
  }, [ecommerceData])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(Math.round(num))
  }

  const ROIResultCard = ({ result, title }: { result: ROIResult | null; title: string }) => {
    if (!result) return null

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Gains mensuels</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(result.monthlyGains)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Gains annuels</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(result.yearlyGains)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Temps économisé</p>
                <p className="text-xl font-bold text-purple-600">{formatNumber(result.timeSaved)}h/mois</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">ROI</p>
                <p className="text-xl font-bold text-orange-600">{formatNumber(result.roi)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Calculator className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Calculateurs ROI IA</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Estimez précisément les gains de productivité et le retour sur investissement des outils IA pour votre
          activité
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="freelance">Freelance</TabsTrigger>
          <TabsTrigger value="pme">PME</TabsTrigger>
          <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
        </TabsList>

        <TabsContent value="freelance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Calculateur ROI Freelance
              </CardTitle>
              <CardDescription>
                Calculez vos gains potentiels en intégrant l'IA dans votre activité freelance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hourlyRate">Tarif horaire (€)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={freelanceData.hourlyRate}
                    onChange={(e) =>
                      setFreelanceData({
                        ...freelanceData,
                        hourlyRate: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="hoursPerWeek">Heures travaillées/semaine</Label>
                  <Input
                    id="hoursPerWeek"
                    type="number"
                    value={freelanceData.hoursPerWeek}
                    onChange={(e) =>
                      setFreelanceData({
                        ...freelanceData,
                        hoursPerWeek: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="toolCost">Coût outils IA/mois (€)</Label>
                  <Input
                    id="toolCost"
                    type="number"
                    value={freelanceData.toolCost}
                    onChange={(e) =>
                      setFreelanceData({
                        ...freelanceData,
                        toolCost: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="timeSaved">Temps économisé (%)</Label>
                  <Input
                    id="timeSaved"
                    type="number"
                    value={freelanceData.timeSavedPercent}
                    onChange={(e) =>
                      setFreelanceData({
                        ...freelanceData,
                        timeSavedPercent: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="qualityImprovement">Amélioration qualité (%)</Label>
                  <Input
                    id="qualityImprovement"
                    type="number"
                    value={freelanceData.qualityImprovement}
                    onChange={(e) =>
                      setFreelanceData({
                        ...freelanceData,
                        qualityImprovement: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <ROIResultCard result={freelanceROI} title="Résultats Freelance" />
        </TabsContent>

        <TabsContent value="pme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Calculateur ROI PME
              </CardTitle>
              <CardDescription>Estimez l'impact de l'IA sur la productivité de votre équipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employees">Nombre d'employés</Label>
                  <Input
                    id="employees"
                    type="number"
                    value={pmeData.employees}
                    onChange={(e) =>
                      setPmeData({
                        ...pmeData,
                        employees: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="averageSalary">Salaire moyen/mois (€)</Label>
                  <Input
                    id="averageSalary"
                    type="number"
                    value={pmeData.averageSalary}
                    onChange={(e) =>
                      setPmeData({
                        ...pmeData,
                        averageSalary: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="toolCostPerUser">Coût outil/utilisateur/mois (€)</Label>
                  <Input
                    id="toolCostPerUser"
                    type="number"
                    value={pmeData.toolCostPerUser}
                    onChange={(e) =>
                      setPmeData({
                        ...pmeData,
                        toolCostPerUser: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="productivityGain">Gain productivité (%)</Label>
                  <Input
                    id="productivityGain"
                    type="number"
                    value={pmeData.productivityGain}
                    onChange={(e) =>
                      setPmeData({
                        ...pmeData,
                        productivityGain: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="customerSatisfaction">Amélioration satisfaction client (%)</Label>
                  <Input
                    id="customerSatisfaction"
                    type="number"
                    value={pmeData.customerSatisfaction}
                    onChange={(e) =>
                      setPmeData({
                        ...pmeData,
                        customerSatisfaction: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <ROIResultCard result={pmeROI} title="Résultats PME" />
        </TabsContent>

        <TabsContent value="ecommerce" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Calculateur ROI E-commerce
              </CardTitle>
              <CardDescription>
                Mesurez l'impact de l'IA sur vos ventes et votre efficacité opérationnelle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyRevenue">CA mensuel (€)</Label>
                  <Input
                    id="monthlyRevenue"
                    type="number"
                    value={ecommerceData.monthlyRevenue}
                    onChange={(e) =>
                      setEcommerceData({
                        ...ecommerceData,
                        monthlyRevenue: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="conversionRate">Taux de conversion (%)</Label>
                  <Input
                    id="conversionRate"
                    type="number"
                    step="0.1"
                    value={ecommerceData.conversionRate}
                    onChange={(e) =>
                      setEcommerceData({
                        ...ecommerceData,
                        conversionRate: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="averageOrderValue">Panier moyen (€)</Label>
                  <Input
                    id="averageOrderValue"
                    type="number"
                    value={ecommerceData.averageOrderValue}
                    onChange={(e) =>
                      setEcommerceData({
                        ...ecommerceData,
                        averageOrderValue: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="toolCostEcom">Coût outils IA/mois (€)</Label>
                  <Input
                    id="toolCostEcom"
                    type="number"
                    value={ecommerceData.toolCost}
                    onChange={(e) =>
                      setEcommerceData({
                        ...ecommerceData,
                        toolCost: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="conversionImprovement">Amélioration conversion (%)</Label>
                  <Input
                    id="conversionImprovement"
                    type="number"
                    value={ecommerceData.conversionImprovement}
                    onChange={(e) =>
                      setEcommerceData({
                        ...ecommerceData,
                        conversionImprovement: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="automationSavings">Économies automatisation (%)</Label>
                  <Input
                    id="automationSavings"
                    type="number"
                    value={ecommerceData.automationSavings}
                    onChange={(e) =>
                      setEcommerceData({
                        ...ecommerceData,
                        automationSavings: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <ROIResultCard result={ecommerceROI} title="Résultats E-commerce" />
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Méthodologie de calcul</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Freelance</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Temps économisé × tarif horaire</li>
                <li>• Bonus qualité sur CA existant</li>
                <li>• Déduction coûts outils</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">PME</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Gains productivité × masse salariale</li>
                <li>• Valeur satisfaction client</li>
                <li>• Coûts outils par utilisateur</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">E-commerce</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Amélioration taux conversion</li>
                <li>• Économies automatisation</li>
                <li>• Coûts plateformes IA</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
