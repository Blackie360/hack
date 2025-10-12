"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

export default function EnvTabs({ slug, projectId, current }: { slug: string; projectId: string; current: string }) {
  const router = useRouter();
  return (
    <Tabs value={current} onValueChange={(v) => router.push(`/dashboard/organization/${slug}/secrets?projectId=${projectId}&env=${v}`)}>
      <TabsList>
        <TabsTrigger value="dev">Dev</TabsTrigger>
        <TabsTrigger value="staging">Staging</TabsTrigger>
        <TabsTrigger value="prod">Prod</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}


