import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, Settings, Printer, CheckCircle, AlertTriangle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DownloadPageProps {
  design: any
}

export function DownloadPage({ design }: DownloadPageProps) {
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([])

  const files = [
    {
      name: 'shoe_upper.stl',
      size: '2.4 MB',
      description: 'Main shoe upper part',
      type: 'STL',
      icon: '📄'
    },
    {
      name: 'shoe_sole.stl',
      size: '1.8 MB',
      description: 'Shoe sole component',
      type: 'STL',
      icon: '📄'
    },
    {
      name: 'print_settings.json',
      size: '2 KB',
      description: 'Recommended printer settings',
      type: 'JSON',
      icon: '⚙️'
    },
    {
      name: 'assembly_guide.pdf',
      size: '1.2 MB',
      description: 'Step-by-step assembly instructions',
      type: 'PDF',
      icon: '📋'
    }
  ]

  const printerSettings = {
    'Layer Height': '0.2mm',
    'Infill Density': '20%',
    'Print Speed': '50mm/s',
    'Nozzle Temperature': '210°C (PLA) / 240°C (TPU)',
    'Bed Temperature': '60°C (PLA) / 50°C (TPU)',
    'Support Material': 'Required for overhangs',
    'Adhesion': 'Brim recommended'
  }

  const printingTips = [
    {
      icon: AlertTriangle,
      title: 'Support Structures',
      description: 'Enable support material for overhangs greater than 45 degrees'
    },
    {
      icon: Info,
      title: 'Orientation',
      description: 'Print the sole flat on the bed for best surface finish'
    },
    {
      icon: Settings,
      title: 'Post-Processing',
      description: 'Light sanding may be needed for smooth surfaces'
    }
  ]

  const handleGenerateFiles = async () => {
    setIsGenerating(true)
    setDownloadProgress(0)
    
    // Simulate file generation progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          setGeneratedFiles(files.map(f => f.name))
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleDownloadFile = (fileName: string) => {
    // In a real app, this would download the actual file
    console.log(`Downloading ${fileName}`)
    
    // Create a mock download
    const element = document.createElement('a')
    element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Mock ${fileName} content`)
    element.download = fileName
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleDownloadAll = () => {
    files.forEach(file => {
      setTimeout(() => handleDownloadFile(file.name), Math.random() * 1000)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Download Center</h1>
          <p className="text-gray-600">Get your 3D printable files and printing instructions</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Generation */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Generate 3D Files</span>
                </CardTitle>
                <CardDescription>
                  Create optimized STL files for 3D printing your custom shoes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isGenerating && generatedFiles.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Printer className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Ready to Generate Files</h3>
                    <p className="text-gray-600 mb-6">
                      Click below to generate your custom 3D printable shoe files
                    </p>
                    <Button 
                      onClick={handleGenerateFiles}
                      className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
                    >
                      Generate 3D Files
                      <Download className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {isGenerating && (
                  <div className="py-8">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Settings className="w-8 h-8 text-primary animate-spin" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Generating Files...</h3>
                      <p className="text-gray-600">Processing your design and creating 3D models</p>
                    </div>
                    <Progress value={downloadProgress} className="h-3" />
                    <p className="text-center text-sm text-gray-600 mt-2">
                      {downloadProgress}% complete
                    </p>
                  </div>
                )}

                {generatedFiles.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Files Generated Successfully</span>
                      </div>
                      <Button onClick={handleDownloadAll} variant="outline">
                        Download All Files
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{file.icon}</span>
                            <div>
                              <h4 className="font-medium text-gray-900">{file.name}</h4>
                              <p className="text-sm text-gray-600">{file.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant="secondary">{file.size}</Badge>
                            <Button 
                              size="sm"
                              onClick={() => handleDownloadFile(file.name)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Printing Instructions</span>
                </CardTitle>
                <CardDescription>
                  Important guidelines for successful 3D printing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="settings" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="settings">Print Settings</TabsTrigger>
                    <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
                    <TabsTrigger value="assembly">Assembly</TabsTrigger>
                  </TabsList>

                  <TabsContent value="settings" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(printerSettings).map(([setting, value]) => (
                        <div key={setting} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-700">{setting}:</span>
                          <span className="text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="tips" className="space-y-4">
                    {printingTips.map((tip, index) => {
                      const Icon = tip.icon
                      return (
                        <Alert key={index}>
                          <Icon className="h-4 w-4" />
                          <div>
                            <h4 className="font-medium">{tip.title}</h4>
                            <AlertDescription>{tip.description}</AlertDescription>
                          </div>
                        </Alert>
                      )
                    })}
                  </TabsContent>

                  <TabsContent value="assembly" className="space-y-4">
                    <div className="space-y-4">
                      {[
                        'Print both shoe parts with supports enabled',
                        'Remove support material carefully with pliers',
                        'Sand any rough surfaces with fine-grit sandpaper',
                        'Test fit the upper to the sole before final assembly',
                        'Use appropriate adhesive if permanent bonding is desired'
                      ].map((step, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-white">{index + 1}</span>
                          </div>
                          <p className="text-gray-700">{step}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Design Summary */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Your Design</CardTitle>
                <CardDescription>Final specifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Style:</span>
                    <span className="font-medium capitalize">{design.style}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium">
                      {design.material === 'flexible' ? 'Flexible TPU' : 
                       design.material === 'rigid' ? 'Rigid PLA' : 'Textured PETG'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Color:</span>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: design.color }}
                      />
                      <span className="font-medium">{design.color}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heel Height:</span>
                    <span className="font-medium">{design.heelHeight}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arch Support:</span>
                    <span className="font-medium">{design.archSupport}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Print Estimates */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Print Estimates</CardTitle>
                <CardDescription>Estimated time and cost</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">8-12 hrs</div>
                    <div className="text-sm text-gray-600">Total print time</div>
                  </div>
                  <div className="text-center p-4 bg-accent/5 rounded-lg">
                    <div className="text-2xl font-bold text-accent">$15-25</div>
                    <div className="text-sm text-gray-600">Material cost</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Check our printing guide or contact support for assistance.
                  </p>
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-700">
                    View Help Center
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}