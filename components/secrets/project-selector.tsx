"use client";

import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProjectSelector({ slug, projects, selectedProjectId }: { slug: string; projects: Array<{ id: string; name: string }>; selectedProjectId?: string }) {
  const router = useRouter();
  const current = selectedProjectId || projects[0]?.id;

  return (
    <Select defaultValue={current} onValueChange={(value) => router.push(`/dashboard/organization/${slug}/secrets?projectId=${value}`)}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select project" />
      </SelectTrigger>
      <SelectContent>
        {projects.map((p) => (
          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}


