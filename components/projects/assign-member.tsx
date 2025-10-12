"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Option = { memberId: string; name: string };

export default function AssignMember({ projectId, options, onAssigned }: { projectId: string; options: Option[]; onAssigned?: () => void }) {
  const [selected, setSelected] = useState(options[0]?.memberId || "");
  const [loading, setLoading] = useState(false);

  async function assign() {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch('/api/project-members', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ projectId, memberId: selected })
      });
      if (!res.ok) return;
      onAssigned?.();
      if (typeof window !== 'undefined') window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  if (options.length === 0) {
    return <div className="text-xs text-muted-foreground">All members are assigned</div>;
  }

  return (
    <div className="flex gap-2 items-center">
      <select value={selected} onChange={(e) => setSelected(e.target.value)} className="border rounded-md bg-background px-2 py-1 text-sm">
        {options.map((o) => (
          <option key={o.memberId} value={o.memberId}>{o.name}</option>
        ))}
      </select>
      <Button onClick={assign} variant="outline" loading={loading} loadingText="Assigning...">Assign</Button>
    </div>
  );
}


