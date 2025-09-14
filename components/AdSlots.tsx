interface AdSlotProps {
  type: "hero" | "inline" | "sidebar" | "mobile"
  id: string
  className?: string
}

export function AdSlots({ type, id, className = "" }: AdSlotProps) {
  const getAdConfig = () => {
    switch (type) {
      case "hero":
        return {
          width: "w-full",
          height: "h-24 md:h-32",
          size: "728x90 / 970x250",
          bgColor: "bg-gray-100",
        }
      case "inline":
        return {
          width: "w-80",
          height: "h-64",
          size: "300x250",
          bgColor: "bg-gray-50",
        }
      case "sidebar":
        return {
          width: "w-80",
          height: "h-96",
          size: "300x400",
          bgColor: "bg-gray-50",
        }
      case "mobile":
        return {
          width: "w-80",
          height: "h-12",
          size: "320x50",
          bgColor: "bg-gray-100",
        }
      default:
        return {
          width: "w-full",
          height: "h-24",
          size: "728x90",
          bgColor: "bg-gray-100",
        }
    }
  }

  const config = getAdConfig()

  return (
    <div
      className={`${config.width} ${config.height} ${config.bgColor} border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm ${className}`}
      data-ad={`${type}-${id}`}
      data-ad-size={config.size}
      data-ad-type={type}
    >
      <div className="text-center">
        <div className="font-medium">Publicité</div>
        <div className="text-xs opacity-75">{config.size}</div>
      </div>
    </div>
  )
}

// Helper function with ad best practices
export function adBestPractices() {
  return {
    maxAdsPerPage: 3,
    recommendations: [
      "Maximum 3 publicités par page pour une meilleure expérience utilisateur",
      "Utiliser le lazy-loading pour les publicités below-the-fold",
      "Respecter les guidelines CLS (Cumulative Layout Shift) de Google",
      "Implémenter des fallbacks en cas d'échec de chargement des publicités",
      "Utiliser des tailles d'annonces responsive (320x50 mobile, 728x90 desktop)",
    ],
    integration: {
      googleAdManager: "Utiliser googletag.cmd.push() pour charger les annonces",
      adSense: "Ajouter le script AdSense et utiliser les data-ad-client attributes",
      lazyLoading: "Implémenter Intersection Observer pour le lazy-loading",
    },
  }
}

// JSX Comment version for documentation
export const AdBestPracticesComment = () => (
  <>
    {/* 
    AD BEST PRACTICES:
    - Maximum 3 ads per page for better UX
    - Use lazy-loading for below-the-fold ads
    - Respect Google's CLS guidelines
    - Implement fallbacks for ad loading failures
    - Use responsive ad sizes (320x50 mobile, 728x90 desktop)
    
    INTEGRATION:
    - Google Ad Manager: Use googletag.cmd.push()
    - AdSense: Add script and data-ad-client attributes
    - Lazy Loading: Implement Intersection Observer
    */}
  </>
)
