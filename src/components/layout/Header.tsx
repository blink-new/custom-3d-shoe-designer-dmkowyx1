import { Button } from "@/components/ui/button"
import { Scan, Palette, Eye, Download, User } from "lucide-react"

interface HeaderProps {
  currentStep: string
  onStepChange: (step: string) => void
}

export function Header({ currentStep, onStepChange }: HeaderProps) {
  const steps = [
    { id: 'home', label: 'Home', icon: User },
    { id: 'scanner', label: 'Foot Scanner', icon: Scan },
    { id: 'design', label: 'Design Studio', icon: Palette },
    { id: 'preview', label: '3D Preview', icon: Eye },
    { id: 'download', label: 'Download', icon: Download },
  ]

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Scan className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Custom 3D Shoe Designer</h1>
        </div>
        
        <nav className="flex items-center space-x-1">
          {steps.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = false // TODO: Track completion state
            
            return (
              <Button
                key={step.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onStepChange(step.id)}
                className={`flex items-center space-x-2 ${
                  isActive ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{step.label}</span>
              </Button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}