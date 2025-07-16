import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Header } from './components/layout/Header'
import { HomePage } from './pages/HomePage'
import { FootScannerPage } from './pages/FootScannerPage'
import { DesignStudioPage } from './pages/DesignStudioPage'
import { PreviewPage } from './pages/PreviewPage'
import { DownloadPage } from './pages/DownloadPage'

type AppStep = 'home' | 'scanner' | 'design' | 'preview' | 'download'

interface User {
  id: string
  email: string
  displayName?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState<AppStep>('home')
  const [footPhotos, setFootPhotos] = useState<string[]>([])
  const [shoeDesign, setShoeDesign] = useState<any>(null)

  // Auth state management
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleStepChange = (step: AppStep) => {
    setCurrentStep(step)
  }

  const handleGetStarted = () => {
    setCurrentStep('scanner')
  }

  const handleScanComplete = (photos: string[]) => {
    setFootPhotos(photos)
    setCurrentStep('design')
  }

  const handleDesignComplete = (design: any) => {
    setShoeDesign(design)
    setCurrentStep('preview')
  }

  const handlePreviewComplete = () => {
    setCurrentStep('download')
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-primary rounded-full animate-ping"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Initializing your shoe designer</p>
        </div>
      </div>
    )
  }

  // Not authenticated state
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">3D</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Custom 3D Shoe Designer</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Sign in to start creating your personalized 3D printable shoes. Our AI will analyze your foot photos and generate custom designs just for you.
          </p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Sign In to Get Started
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentStep={currentStep} onStepChange={handleStepChange} />
      
      <main>
        {currentStep === 'home' && (
          <HomePage onGetStarted={handleGetStarted} />
        )}
        
        {currentStep === 'scanner' && (
          <FootScannerPage onComplete={handleScanComplete} />
        )}
        
        {currentStep === 'design' && footPhotos.length > 0 && (
          <DesignStudioPage 
            photos={footPhotos} 
            onComplete={handleDesignComplete} 
          />
        )}
        
        {currentStep === 'preview' && shoeDesign && (
          <PreviewPage 
            design={shoeDesign} 
            onComplete={handlePreviewComplete} 
          />
        )}
        
        {currentStep === 'download' && shoeDesign && (
          <DownloadPage design={shoeDesign} />
        )}
      </main>
    </div>
  )
}

export default App