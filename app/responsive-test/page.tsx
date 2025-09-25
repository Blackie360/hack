"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  GraduationCap, 
  Clock, 
  TrendingUp,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle
} from "lucide-react"

export default function ResponsiveTest() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">Responsive Design Test</h1>
        <p className="text-muted-foreground">
          Test the app's responsiveness across different screen sizes
        </p>
      </div>

      {/* Responsive Grid Demo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="relative overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Mobile</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">📱</p>
                <div className="flex items-center mt-1 md:mt-2">
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-1" />
                  <span className="text-xs md:text-sm text-green-500">Optimized</span>
                </div>
              </div>
              <div className="p-2 md:p-3 bg-blue-500/10 rounded-xl">
                <Smartphone className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Tablet</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">📱</p>
                <div className="flex items-center mt-1 md:mt-2">
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-1" />
                  <span className="text-xs md:text-sm text-green-500">Responsive</span>
                </div>
              </div>
              <div className="p-2 md:p-3 bg-green-500/10 rounded-xl">
                <Tablet className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Desktop</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">💻</p>
                <div className="flex items-center mt-1 md:mt-2">
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-1" />
                  <span className="text-xs md:text-sm text-green-500">Full Features</span>
                </div>
              </div>
              <div className="p-2 md:p-3 bg-purple-500/10 rounded-xl">
                <Monitor className="h-5 w-5 md:h-6 md:w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Large Screen</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">🖥️</p>
                <div className="flex items-center mt-1 md:mt-2">
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-1" />
                  <span className="text-xs md:text-sm text-green-500">Enhanced</span>
                </div>
              </div>
              <div className="p-2 md:p-3 bg-orange-500/10 rounded-xl">
                <Monitor className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Responsive Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Mobile Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Collapsible sidebar with overlay</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Touch-friendly buttons and inputs</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Optimized text sizes and spacing</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Horizontal scrolling for tables</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Stacked layouts for forms</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Desktop Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Fixed sidebar navigation</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Multi-column layouts</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Hover effects and tooltips</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Full-width tables and charts</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Side-by-side form layouts</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Responsive Breakpoints */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Responsive Breakpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-sm">Mobile</p>
                <p className="text-xs text-muted-foreground">Default styles</p>
              </div>
              <Badge variant="outline">0px - 640px</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-sm">Small (sm)</p>
                <p className="text-xs text-muted-foreground">Small tablets</p>
              </div>
              <Badge variant="outline">640px+</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-sm">Medium (md)</p>
                <p className="text-xs text-muted-foreground">Tablets</p>
              </div>
              <Badge variant="outline">768px+</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-sm">Large (lg)</p>
                <p className="text-xs text-muted-foreground">Laptops</p>
              </div>
              <Badge variant="outline">1024px+</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium text-sm">Extra Large (xl)</p>
                <p className="text-xs text-muted-foreground">Desktops</p>
              </div>
              <Badge variant="outline">1280px+</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Instructions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Browser Testing:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Open Developer Tools (F12)</li>
              <li>• Click the device toggle button</li>
              <li>• Test different screen sizes</li>
              <li>• Check sidebar behavior on mobile</li>
              <li>• Verify table scrolling on small screens</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Real Device Testing:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Test on actual mobile devices</li>
              <li>• Check touch interactions</li>
              <li>• Verify text readability</li>
              <li>• Test form inputs and buttons</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
