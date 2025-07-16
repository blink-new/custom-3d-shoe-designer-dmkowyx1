import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Scan, Palette, Eye, Download, ArrowRight, Zap, Shield, Sparkles } from "lucide-react"

interface HomePageProps {
  onGetStarted: () => void
}

export function HomePage({ onGetStarted }: HomePageProps) {
  const features = [
    {
      icon: Scan,
      title: "AI Foot Analysis",
      description: "Advanced computer vision analyzes your foot photos to extract precise measurements and shape data."
    },
    {
      icon: Palette,
      title: "Custom Design Studio",
      description: "Choose from athletic, casual, or formal styles with full customization of materials and colors."
    },
    {
      icon: Eye,
      title: "3D Preview",
      description: "Interactive 3D visualization lets you see your custom shoes from every angle before printing."
    },
    {
      icon: Download,
      title: "3D Print Ready",
      description: "Download STL files optimized for 3D printing with detailed preparation guidelines."
    }
  ]

  const benefits = [
    { icon: Zap, text: "Perfect fit guaranteed" },
    { icon: Shield, text: "Professional-grade accuracy" },
    { icon: Sparkles, text: "Unlimited customization" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Design Your Perfect
            <span className="text-primary block">Custom 3D Shoes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Take photos of your feet and let our AI create personalized 3D printable shoe designs 
            tailored to your exact measurements and style preferences.
          </p>
          
          <div className="flex items-center justify-center space-x-6 mb-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="flex items-center space-x-2 text-gray-700">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="font-medium">{benefit.text}</span>
                </div>
              )
            })}
          </div>

          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Start Designing Your Shoes
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Process Steps */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Capture", desc: "Take photos of your feet from multiple angles" },
              { step: "02", title: "Analyze", desc: "AI extracts precise measurements and shape data" },
              { step: "03", title: "Design", desc: "Customize style, materials, and colors" },
              { step: "04", title: "Print", desc: "Download 3D files ready for printing" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}