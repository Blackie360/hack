/**
 * Font Showcase Component
 * Demonstrates the creative fonts used in LockIn
 * You can import and use this on any page to see the fonts in action
 */

export function FontShowcase() {
  return (
    <div className="space-y-12 p-8">
      {/* Space Grotesk - Main Sans Serif */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Space Grotesk (Main Font)
        </h3>
        <div className="space-y-2">
          <p className="text-4xl font-light">The quick brown fox jumps</p>
          <p className="text-3xl font-normal">Secure your environment variables</p>
          <p className="text-2xl font-medium">Cross-device synchronization</p>
          <p className="text-xl font-semibold">End-to-end encryption</p>
          <p className="text-lg font-bold">Team collaboration made easy</p>
        </div>
      </div>

      {/* Syne - Heading Font */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Syne (Heading Font)
        </h3>
        <div className="space-y-2 font-heading">
          <h1 className="text-6xl font-extrabold">LockIn</h1>
          <h2 className="text-5xl font-bold">Secure by Design</h2>
          <h3 className="text-4xl font-semibold">Built for Developers</h3>
          <h4 className="text-3xl font-medium">Modern & Fast</h4>
        </div>
      </div>

      {/* JetBrains Mono - Monospace */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          JetBrains Mono (Code Font)
        </h3>
        <div className="space-y-2 font-mono">
          <p className="text-2xl">DATABASE_URL=postgresql://</p>
          <p className="text-xl">const encrypted = await encrypt(data);</p>
          <p className="text-lg">npm install @lockin/sdk</p>
          <code className="block bg-muted p-4 rounded-lg">
            <pre className="text-sm">{`{
  "name": "lockin",
  "version": "1.0.0",
  "type": "secure"
}`}</pre>
          </code>
        </div>
      </div>

      {/* Creative Text Effects */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Creative Text Effects
        </h3>
        <div className="space-y-6">
          <p className="text-4xl font-display">Display Font - Bold & Tight</p>
          <p className="text-3xl text-gradient">Gradient Text Effect</p>
          <p className="text-3xl text-cyber">Cyber Security</p>
          <p className="text-3xl font-heading text-glow">Glowing Text</p>
        </div>
      </div>

      {/* Example Usage */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Utility Classes
        </h3>
        <div className="space-y-2 text-sm font-mono">
          <code className="block">• font-heading - Use Syne font</code>
          <code className="block">• font-display - Extra bold heading style</code>
          <code className="block">• font-mono - JetBrains Mono code font</code>
          <code className="block">• text-gradient - Gradient text effect</code>
          <code className="block">• text-glow - Glowing text shadow</code>
          <code className="block">• text-cyber - Uppercase cyber style</code>
        </div>
      </div>
    </div>
  );
}

