import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Camera, RotateCcw, Check, ArrowRight, AlertCircle, Upload, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FootScannerPageProps {
  onComplete: (photos: string[]) => void
}

export function FootScannerPage({ onComplete }: FootScannerPageProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([])
  const [isCapturing, setIsCapturing] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [permissionState, setPermissionState] = useState<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const checkCameraPermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName })
      setPermissionState(permission.state)
      return permission.state
    } catch (error) {
      console.log('Permission API not supported')
      return 'unknown'
    }
  }

  const startCamera = async () => {
    setCameraError(null)
    
    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported by this browser')
      }

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
      setPermissionState('granted')
      setCameraError(null)
    } catch (error: any) {
      console.error('Error accessing camera:', error)
      setIsCapturing(false)
      setPermissionState('denied')
      
      let errorMessage = 'Unable to access camera. '
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera access and try again.'
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.'
      } else if (error.name === 'NotSupportedError') {
        errorMessage += 'Camera not supported by this browser.'
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is being used by another application.'
      } else {
        errorMessage += 'Please check your camera settings and try again.'
      }
      
      setCameraError(errorMessage)
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const photoDataUrl = e.target?.result as string
        const newPhotos = [...capturedPhotos, photoDataUrl]
        setCapturedPhotos(newPhotos)
        
        if (currentStep < scanSteps.length - 1) {
          setCurrentStep(currentStep + 1)
        } else {
          onComplete(newPhotos)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const retryCamera = () => {
    setCameraError(null)
    setPermissionState('unknown')
    startCamera()
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
              {/* Camera Error Alert */}
              {cameraError && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {cameraError}
                  </AlertDescription>
                </Alert>
              )}

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
                      {cameraError && (
                        <p className="text-sm text-red-600 mt-2">Camera access failed</p>
                      )}
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
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="space-y-3">
                {/* Camera Controls */}
                <div className="flex space-x-3">
                  {!isCapturing ? (
                    <>
                      <Button onClick={startCamera} className="flex-1">
                        <Camera className="w-4 h-4 mr-2" />
                        Start Camera
                      </Button>
                      {cameraError && (
                        <Button variant="outline" onClick={retryCamera}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Retry
                        </Button>
                      )}
                    </>
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

                {/* File Upload Alternative */}
                {(cameraError || !isCapturing) && (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>
                )}

                {(cameraError || !isCapturing) && (
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo from Device
                  </Button>
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
                {cameraError && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      <strong>Camera Access Issue:</strong> If you're having trouble with camera access, try refreshing the page and allowing camera permissions when prompted. You can also upload photos directly from your device.
                    </AlertDescription>
                  </Alert>
                )}
                
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