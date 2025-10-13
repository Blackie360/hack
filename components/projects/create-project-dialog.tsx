"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function CreateProjectDialog({ orgId }: { orgId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  async function create() {
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ orgId, name, slug })
      });
      if (!res.ok) return;
      const data = await res.json();
      setOpen(false);
      setName("");
      setSlug("");
      if (typeof window !== 'undefined') {
        // redirect to secrets for the new project
        window.location.href = `/dashboard/organization/${window.location.pathname.split('/').slice(-1)[0]}/secrets?projectId=${data.project.id}`;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">New Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <Input placeholder="Slug" value={slug} onChange={e => setSlug(e.target.value)} />
          <div className="flex justify-end">
            <Button onClick={create} disabled={loading || !name || !slug}>{loading ? "Creating..." : "Create"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


