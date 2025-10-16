// removed theme switcher for dark-only UI
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import GrainOverlay from "@/components/grain-overlay";
import { 
  Shield, 
  Lock, 
  Zap, 
  Users, 
  Globe, 
  Key, 
  Clock,
  CheckCircle2,
  ArrowRight,
  Code2,
  Server,
  GitBranch
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Grain Overlay for Creative Effect */}
      <GrainOverlay />
      
      {/* Ambient background layers */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.4] dark:opacity-[0.25]" />
      <div className="pointer-events-none absolute inset-0 bg-spotlight" />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-gradient">LockIn</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#security" className="hover:text-foreground transition-colors">Security</a>
            <a href="#use-cases" className="hover:text-foreground transition-colors">Use cases</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="animate-pulse-glow">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6 animate-fade-up">
            <Shield className="h-4 w-4" />
            End-to-End Encrypted
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl text-gradient animate-fade-up [animation-delay:70ms]">
            Share API Keys <br />
            <span className="text-primary">Instantly & Securely</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mb-10 animate-fade-up [animation-delay:120ms]">
            Perfect for hackathons and small teams. Share environment variables instantly without 
            compromising security. No more Slack DMs or insecure .env files.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-up [animation-delay:180ms]">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 gap-2 group">
                Start Hackathon
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Join Team
              </Button>
            </Link>
          </div>

          {/* Hero Visual */}
          <div className="relative w-full max-w-5xl animate-fade-up [animation-delay:240ms]">
            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
            <Card className="relative p-8 glass border border-primary/10 shadow-2xl opacity-60 hover:opacity-80 hover:scale-105 transition-all duration-300 ease-out">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground/70">
                    <Code2 className="h-4 w-4" />
                    <span className="font-mono">.env.production</span>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-4 font-mono text-sm text-left space-y-2">
                    <div className="flex items-start gap-2">
                      <Key className="h-4 w-4 text-primary/60 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground/60">DATABASE_URL=***</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Key className="h-4 w-4 text-primary/60 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground/60">API_KEY=***</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Key className="h-4 w-4 text-primary/60 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground/60">JWT_SECRET=***</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-primary/50" />
                      </div>
                      <ArrowRight className="h-6 w-6 text-muted-foreground/50" />
                      <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center">
                        <Globe className="h-6 w-6 text-primary/50" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground/60">
                      Encrypted & Synced Across Devices
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for Hackathons & Small Teams
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share API keys instantly without the security risks. Perfect for rapid prototyping and team collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 glass border border-transparent hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Perfect for Hackathons & Small Teams
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From weekend hackathons to small startup teams, LockIn makes API key sharing effortless
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <Card 
              key={index}
              className="p-8 text-center glass border border-primary/20 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {useCase.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
              <p className="text-muted-foreground mb-6">{useCase.description}</p>
              <ul className="space-y-2 text-sm text-left">
                {useCase.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="container mx-auto px-4 py-20">
        <Card className="p-12 bg-gradient-to-br from-primary/5 via-card to-primary/5 border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Shield className="h-4 w-4" />
                Bank-Grade Security
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Your Secrets Are <span className="text-primary">Safe With Us</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We take security seriously. Your environment variables are encrypted 
                end-to-end, and we never have access to your unencrypted data.
              </p>
              <div className="space-y-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{feature.title}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 text-center bg-card">
                  <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="text-2xl font-bold mb-1">AES-256</p>
                  <p className="text-sm text-muted-foreground">Encryption</p>
                </Card>
                <Card className="p-6 text-center bg-card">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="text-2xl font-bold mb-1">Zero-Trust</p>
                  <p className="text-sm text-muted-foreground">Architecture</p>
                </Card>
                <Card className="p-6 text-center bg-card">
                  <Server className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="text-2xl font-bold mb-1">99.9%</p>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                </Card>
                <Card className="p-6 text-center bg-card">
                  <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="text-2xl font-bold mb-1">RBAC</p>
                  <p className="text-sm text-muted-foreground">Access Control</p>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 text-center bg-gradient-to-br from-primary/10 via-card to-primary/5 border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Share API Keys Securely?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Perfect for your next hackathon or small team project. Get your team set up 
            in under 2 minutes and start sharing API keys securely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 gap-2 group">
                Start Your Hackathon
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Join Team
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Free for small teams • Set up in 2 minutes
          </p>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold">LockIn</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 LockIn. Built for developers who value security.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "Instant Sharing",
    description: "Share API keys with your hackathon team in seconds. No more copying/pasting in Slack DMs."
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "Team Collaboration",
    description: "Perfect for small teams. Add members instantly and share project secrets securely."
  },
  {
    icon: <Lock className="h-6 w-6 text-primary" />,
    title: "Hackathon-Safe",
    description: "End-to-end encrypted sharing. Safe even on public WiFi at hackathon venues."
  },
  {
    icon: <Globe className="h-6 w-6 text-primary" />,
    title: "Cross-Device Sync",
    description: "Access your team's API keys from laptop, phone, or any device. Perfect for switching machines."
  },
  {
    icon: <Key className="h-6 w-6 text-primary" />,
    title: "Quick Setup",
    description: "Get your team up and running in under 2 minutes. Import existing .env files instantly."
  },
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "Temporary Access",
    description: "Set expiration dates for hackathon projects. Keys auto-expire when the event ends."
  }
];

const useCases = [
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Hackathon Teams",
    description: "Share API keys instantly during weekend builds",
    points: [
      "Set up team in under 2 minutes",
      "Share keys without Slack DMs",
      "Auto-expire after hackathon ends",
      "Safe on public WiFi networks"
    ]
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Small Dev Teams",
    description: "Perfect for 2-10 person teams",
    points: [
      "Instant team member invites",
      "Project-based key sharing",
      "No complex enterprise setup",
      "Free for small teams"
    ]
  },
  {
    icon: <GitBranch className="h-8 w-8 text-primary" />,
    title: "Startup Teams",
    description: "Secure API key management for early-stage companies",
    points: [
      "Quick onboarding for new hires",
      "Client project separation",
      "Easy key rotation",
      "Audit trail for compliance"
    ]
  }
];

const securityFeatures = [
  {
    title: "AES-256 Encryption",
    description: "Military-grade encryption protects your data at rest and in transit"
  },
  {
    title: "Zero-Knowledge Architecture",
    description: "We can't access your secrets even if we wanted to"
  },
  {
    title: "SOC 2 Compliant",
    description: "Regular security audits and compliance certifications"
  },
  {
    title: "2FA & SSO Support",
    description: "Additional layers of protection for team accounts"
  }
];
