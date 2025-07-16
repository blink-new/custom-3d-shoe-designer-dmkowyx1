import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Camera, RotateCcw, Check, ArrowRight, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FootScannerPageProps {
  onComplete: (photos: string[]) => void
}

export function FootScannerPage({ onComplete }: FootScannerPageProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([])
  const [isCapturing, setIsCapturing] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const scanSteps = [
    {
      title: "Top View",
      description: "Place your foot flat on the ground and take a photo from directly above",
      icon: "📷",
      angle: "top"
    },
    {
      title: "Side View (Left)",
      description: "Take a photo of your foot from the left side",
      icon: "📷",
      angle: "side-left"
    },
    {
      title: "Side View (Right)",
      description: "Take a photo of your foot from the right side",
      icon: "📷",
      angle: "side-right"
    },
    {
      title: "Front View",
      description: "Take a photo of your foot from the front (toes facing camera)",
      icon: "📷",
      angle: "front"
    }
  ]

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setIsCapturing(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCapturing(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      if (context) {
        context.drawImage(video, 0, 0)
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8)
        
        const newPhotos = [...capturedPhotos, photoDataUrl]
        setCapturedPhotos(newPhotos)
        
        if (currentStep < scanSteps.length - 1) {
          setCurrentStep(currentStep + 1)
        } else {
          stopCamera()
          onComplete(newPhotos)
        }
      }
    }
  }

  const retakePhoto = () => {
    const newPhotos = capturedPhotos.slice(0, -1)
    setCapturedPhotos(newPhotos)
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = ((capturedPhotos.length) / scanSteps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Foot Scanner</h1>
            <div className="text-sm text-gray-600">
              Step {capturedPhotos.length + 1} of {scanSteps.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Camera Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>{scanSteps[currentStep]?.title}</span>
              </CardTitle>
              <CardDescription>
                {scanSteps[currentStep]?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video mb-4">
                {isCapturing ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>Camera preview will appear here</p>
                    </div>
                  </div>
                )}
                
                {/* Foot positioning guide overlay */}
                {isCapturing && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-4 border-2 border-primary border-dashed rounded-lg flex items-center justify-center">
                      <div className="text-white bg-black/50 px-3 py-1 rounded text-sm">
                        Position your foot here
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <canvas ref={canvasRef} className="hidden" />

              <div className="flex space-x-3">
                {!isCapturing ? (
                  <Button onClick={startCamera} className="flex-1">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                ) : (
                  <>
                    <Button onClick={capturePhoto} className="flex-1">
                      <Camera className="w-4 h-4 mr-2" />
                      Capture Photo
                    </Button>
                    {capturedPhotos.length > 0 && (
                      <Button variant="outline" onClick={retakePhoto}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Retake
                      </Button>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instructions & Progress */}
          <div className="space-y-6">
            {/* Current Step Instructions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Photography Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Ensure good lighting and place your foot on a contrasting surface for best results.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">1</span>
                    </div>
                    <p className="text-sm text-gray-600">Remove shoes and socks completely</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">2</span>
                    </div>
                    <p className="text-sm text-gray-600">Stand on a flat, light-colored surface</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">3</span>
                    </div>
                    <p className="text-sm text-gray-600">Keep your foot relaxed and natural</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">4</span>
                    </div>
                    <p className="text-sm text-gray-600">Fill the frame with your foot</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step Progress */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Scan Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scanSteps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index < capturedPhotos.length 
                          ? 'bg-green-100 text-green-600' 
                          : index === currentStep 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-400'
                      }`}>
                        {index < capturedPhotos.length ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-sm text-gray-500">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}