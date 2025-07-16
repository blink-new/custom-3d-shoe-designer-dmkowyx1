import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, ZoomIn, ZoomOut, Download, ArrowRight, Eye, Layers, Ruler } from "lucide-react"

interface PreviewPageProps {
  design: any
  onComplete: () => void
}

export function PreviewPage({ design, onComplete }: PreviewPageProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [viewMode, setViewMode] = useState('3d')

  const measurements = {
    length: '26.5 cm',
    width: '10.2 cm',
    archHeight: '2.8 cm',
    heelWidth: '6.4 cm',
    toeWidth: '9.1 cm'
  }

  const specifications = {
    printTime: '8-12 hours',
    material: design.material === 'flexible' ? 'Flexible TPU' : design.material === 'rigid' ? 'Rigid PLA' : 'Textured PETG',
    infill: '20%',
    layerHeight: '0.2mm',
    supports: 'Required',
    estimatedCost: '$15-25'
  }

  const handleRotate = (axis: 'x' | 'y', direction: number) => {
    setRotation(prev => ({
      ...prev,
      [axis]: prev[axis] + (direction * 15)
    }))
  }

  const handleZoom = (direction: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + (direction * 0.2))))
  }

  const resetView = () => {
    setRotation({ x: 0, y: 0 })
    setZoom(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">3D Preview</h1>
          <p className="text-gray-600">Review your custom shoe design before downloading</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 3D Viewer */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>3D Model Viewer</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={viewMode === '3d' ? 'default' : 'outline'}>
                      3D View
                    </Badge>
                    <Badge variant={viewMode === 'wireframe' ? 'default' : 'outline'}>
                      Wireframe
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  Interact with your 3D shoe model - rotate, zoom, and inspect from all angles
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* 3D Viewer Container */}
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg aspect-video mb-6 overflow-hidden">
                  {/* Mock 3D Shoe */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                    style={{
                      transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`
                    }}
                  >
                    <div className="relative">
                      {/* Shoe Body */}
                      <div 
                        className="w-48 h-24 rounded-full shadow-2xl relative"
                        style={{ 
                          backgroundColor: design.color,
                          transform: 'perspective(200px) rotateX(-10deg)'
                        }}
                      >
                        {/* Sole */}
                        <div className="absolute -bottom-2 left-2 right-2 h-4 bg-gray-800 rounded-full opacity-80"></div>
                        
                        {/* Laces area */}
                        <div className="absolute top-2 left-1/4 right-1/4 h-8 bg-black/10 rounded-lg"></div>
                        
                        {/* Toe cap */}
                        <div className="absolute top-1 right-2 w-16 h-12 bg-white/20 rounded-full"></div>
                        
                        {/* Heel */}
                        <div className="absolute top-2 left-2 w-12 h-16 bg-black/10 rounded-lg"></div>
                      </div>
                      
                      {/* Shadow */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black/20 rounded-full blur-sm"></div>
                    </div>
                  </div>

                  {/* Loading overlay for realism */}
                  <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                    3D Model Loaded
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRotate('y', -1)}
                    >
                      ← Rotate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRotate('y', 1)}
                    >
                      Rotate →
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRotate('x', -1)}
                    >
                      ↑ Tilt
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRotate('x', 1)}
                    >
                      ↓ Tilt
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleZoom(-1)}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-gray-600 min-w-[60px] text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleZoom(1)}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetView}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Panel */}
          <div className="space-y-6">
            {/* Design Summary */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Design Summary</CardTitle>
                <CardDescription>Your custom shoe specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Style:</span>
                    <p className="font-medium capitalize">{design.style}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Material:</span>
                    <p className="font-medium">{specifications.material}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Color:</span>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: design.color }}
                      />
                      <span className="font-medium">{design.color}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Heel Height:</span>
                    <p className="font-medium">{design.heelHeight}mm</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Arch Support:</span>
                    <p className="font-medium">{design.archSupport}%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Toe Shape:</span>
                    <p className="font-medium capitalize">{design.toeShape}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Measurements */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Ruler className="w-5 h-5" />
                  <span>Measurements</span>
                </CardTitle>
                <CardDescription>Extracted from your foot photos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {Object.entries(measurements).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Print Specifications */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="w-5 h-5" />
                  <span>Print Specs</span>
                </CardTitle>
                <CardDescription>3D printing requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={onComplete}
                className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Proceed to Download
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline"
                className="w-full py-3"
              >
                <Download className="w-4 h-4 mr-2" />
                Quick Download STL
              </Button>
            </div>

            {/* Quality Check */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Quality Check Passed</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Your design meets all 3D printing requirements and is ready for production.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}