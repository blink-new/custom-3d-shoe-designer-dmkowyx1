import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Palette, Layers, Ruler, ArrowRight, Sparkles } from "lucide-react"

interface DesignStudioPageProps {
  photos: string[]
  onComplete: (design: any) => void
}

export function DesignStudioPage({ photos, onComplete }: DesignStudioPageProps) {
  const [selectedStyle, setSelectedStyle] = useState('athletic')
  const [selectedMaterial, setSelectedMaterial] = useState('flexible')
  const [selectedColor, setSelectedColor] = useState('#2563EB')
  const [heelHeight, setHeelHeight] = useState([15])
  const [archSupport, setArchSupport] = useState([50])
  const [toeShape, setToeShape] = useState('rounded')

  const styles = [
    {
      id: 'athletic',
      name: 'Athletic',
      description: 'Performance-focused design for sports and active wear',
      image: '🏃‍♂️',
      features: ['Breathable mesh', 'Shock absorption', 'Flexible sole']
    },
    {
      id: 'casual',
      name: 'Casual',
      description: 'Comfortable everyday wear with modern styling',
      image: '👟',
      features: ['All-day comfort', 'Versatile design', 'Durable materials']
    },
    {
      id: 'formal',
      name: 'Formal',
      description: 'Elegant design suitable for professional settings',
      image: '👞',
      features: ['Premium finish', 'Classic styling', 'Professional look']
    }
  ]

  const materials = [
    {
      id: 'flexible',
      name: 'Flexible TPU',
      description: 'Soft, bendable material perfect for comfort',
      properties: ['Flexible', 'Comfortable', 'Lightweight']
    },
    {
      id: 'rigid',
      name: 'Rigid PLA',
      description: 'Strong, durable material for structure',
      properties: ['Durable', 'Supportive', 'Long-lasting']
    },
    {
      id: 'textured',
      name: 'Textured PETG',
      description: 'Textured surface for enhanced grip',
      properties: ['Non-slip', 'Textured', 'Weather-resistant']
    }
  ]

  const colors = [
    '#2563EB', '#DC2626', '#059669', '#D97706', 
    '#7C3AED', '#DB2777', '#0891B2', '#65A30D',
    '#374151', '#FFFFFF', '#000000', '#F59E0B'
  ]

  const toeShapes = [
    { id: 'rounded', name: 'Rounded', description: 'Classic comfortable fit' },
    { id: 'pointed', name: 'Pointed', description: 'Sleek, modern look' },
    { id: 'square', name: 'Square', description: 'Maximum toe room' }
  ]

  const handleGenerateDesign = () => {
    const design = {
      style: selectedStyle,
      material: selectedMaterial,
      color: selectedColor,
      heelHeight: heelHeight[0],
      archSupport: archSupport[0],
      toeShape,
      photos,
      timestamp: Date.now()
    }
    onComplete(design)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Design Studio</h1>
          <p className="text-gray-600">Customize your shoe design based on your foot measurements</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Design Controls */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="style" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="fit">Fit</TabsTrigger>
              </TabsList>

              {/* Style Selection */}
              <TabsContent value="style" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5" />
                      <span>Choose Your Style</span>
                    </CardTitle>
                    <CardDescription>
                      Select the type of shoe that best fits your needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {styles.map((style) => (
                        <div
                          key={style.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedStyle === style.id
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedStyle(style.id)}
                        >
                          <div className="text-center mb-3">
                            <div className="text-3xl mb-2">{style.image}</div>
                            <h3 className="font-semibold text-gray-900">{style.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{style.description}</p>
                          </div>
                          <div className="space-y-1">
                            {style.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Materials Selection */}
              <TabsContent value="materials" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Layers className="w-5 h-5" />
                      <span>Material Selection</span>
                    </CardTitle>
                    <CardDescription>
                      Choose the 3D printing material for your shoes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {materials.map((material) => (
                        <div
                          key={material.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedMaterial === material.id
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedMaterial(material.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{material.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                            </div>
                            <div className="flex flex-wrap gap-1 ml-4">
                              {material.properties.map((prop, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {prop}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Colors Selection */}
              <TabsContent value="colors" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Palette className="w-5 h-5" />
                      <span>Color Customization</span>
                    </CardTitle>
                    <CardDescription>
                      Pick your favorite color for the shoe design
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-6 gap-3">
                      {colors.map((color) => (
                        <button
                          key={color}
                          className={`w-12 h-12 rounded-lg border-2 transition-all ${
                            selectedColor === color
                              ? 'border-gray-900 scale-110'
                              : 'border-gray-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Selected color: <span className="font-medium" style={{ color: selectedColor }}>{selectedColor}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Fit Adjustments */}
              <TabsContent value="fit" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Ruler className="w-5 h-5" />
                      <span>Fit Adjustments</span>
                    </CardTitle>
                    <CardDescription>
                      Fine-tune the fit based on your preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Heel Height */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heel Height: {heelHeight[0]}mm
                      </label>
                      <Slider
                        value={heelHeight}
                        onValueChange={setHeelHeight}
                        max={50}
                        min={5}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Flat (5mm)</span>
                        <span>High (50mm)</span>
                      </div>
                    </div>

                    {/* Arch Support */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Arch Support: {archSupport[0]}%
                      </label>
                      <Slider
                        value={archSupport}
                        onValueChange={setArchSupport}
                        max={100}
                        min={0}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Minimal</span>
                        <span>Maximum</span>
                      </div>
                    </div>

                    {/* Toe Shape */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Toe Shape
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {toeShapes.map((shape) => (
                          <button
                            key={shape.id}
                            className={`p-3 rounded-lg border-2 text-center transition-all ${
                              toeShape === shape.id
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setToeShape(shape.id)}
                          >
                            <div className="font-medium text-sm">{shape.name}</div>
                            <div className="text-xs text-gray-600 mt-1">{shape.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview & Actions */}
          <div className="space-y-6">
            {/* Design Preview */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Design Preview</CardTitle>
                <CardDescription>Your custom shoe design</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">👟</div>
                    <p className="text-sm text-gray-600">3D preview will appear here</p>
                  </div>
                </div>
                
                {/* Design Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Style:</span>
                    <span className="font-medium capitalize">{selectedStyle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium">{materials.find(m => m.id === selectedMaterial)?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Color:</span>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: selectedColor }}
                      />
                      <span className="font-medium">{selectedColor}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heel Height:</span>
                    <span className="font-medium">{heelHeight[0]}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arch Support:</span>
                    <span className="font-medium">{archSupport[0]}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Toe Shape:</span>
                    <span className="font-medium capitalize">{toeShape}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button 
              onClick={handleGenerateDesign}
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Generate 3D Design
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            {/* Foot Photos */}
            <Card>
              <CardHeader>
                <CardTitle>Your Foot Scans</CardTitle>
                <CardDescription>Photos used for measurements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {photos.slice(0, 4).map((photo, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={photo} 
                        alt={`Foot scan ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
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