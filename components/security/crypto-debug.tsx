"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getOrgKey, getKeyMetadata } from "@/lib/crypto/org-key-manager";
import { encryptAesGcm, decryptAesGcm } from "@/lib/crypto/secret";

export default function CryptoDebug() {
  const [status, setStatus] = useState<{
    hasKey: boolean;
    keyLength: number | null;
    metadata: any;
    testPassed: boolean | null;
  }>({
    hasKey: false,
    keyLength: null,
    metadata: null,
    testPassed: null,
  });

  useEffect(() => {
    checkCrypto();
  }, []);

  function checkCrypto() {
    const key = getOrgKey();
    const metadata = getKeyMetadata();
    
    setStatus({
      hasKey: !!key,
      keyLength: key?.length || null,
      metadata,
      testPassed: null,
    });
  }

  async function testEncryptionDecryption() {
    const key = getOrgKey();
    if (!key) {
      setStatus(prev => ({ ...prev, testPassed: false }));
      return;
    }

    try {
      const testData = new TextEncoder().encode("test-secret-value");
      const testAad = new TextEncoder().encode("test:aad:data");
      
      // Encrypt
      const { ciphertext, iv } = await encryptAesGcm(key, testData, testAad);
      console.log("[CryptoDebug] Encrypted test data");
      
      // Decrypt
      const decrypted = await decryptAesGcm(key, iv, ciphertext, testAad);
      const decryptedText = new TextDecoder().decode(decrypted);
      
      const passed = decryptedText === "test-secret-value";
      console.log("[CryptoDebug] Test", passed ? "PASSED" : "FAILED");
      
      setStatus(prev => ({ ...prev, testPassed: passed }));
    } catch (e) {
      console.error("[CryptoDebug] Test FAILED:", e);
      setStatus(prev => ({ ...prev, testPassed: false }));
    }
  }

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="p-4 bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-800">
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">🔧 Crypto Debug (Dev Only)</h3>
        
        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Key Status:</span>
            <span className={status.hasKey ? "text-green-600" : "text-red-600"}>
              {status.hasKey ? "✅ Initialized" : "❌ Not Initialized"}
            </span>
          </div>
          
          {status.keyLength && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Key Length:</span>
              <span>{status.keyLength} bytes</span>
            </div>
          )}
          
          {status.metadata && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Key For:</span>
              <span>User: {status.metadata.userId?.substring(0, 8)}..., Org: {status.metadata.orgId?.substring(0, 8)}...</span>
            </div>
          )}
          
          {status.testPassed !== null && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Encrypt/Decrypt Test:</span>
              <span className={status.testPassed ? "text-green-600" : "text-red-600"}>
                {status.testPassed ? "✅ PASSED" : "❌ FAILED"}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={checkCrypto}>
            Refresh Status
          </Button>
          <Button size="sm" variant="outline" onClick={testEncryptionDecryption} disabled={!status.hasKey}>
            Test Encrypt/Decrypt
          </Button>
        </div>
      </div>
    </Card>
  );
}

