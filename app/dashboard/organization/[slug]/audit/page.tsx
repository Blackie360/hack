"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

type Log = {
  id: string;
  action: string;
  targetType: string;
  targetId: string | null;
  meta: string | null;
  createdAt: string;
};

export default function AuditPage() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/audit');
      const data = await res.json();
      setLogs(data.logs ?? []);
    })();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-3">Audit Log</h2>
        {logs.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon" />
              <EmptyTitle>No audit events</EmptyTitle>
              <EmptyDescription>Actions taken within your organization will show up here.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Meta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map(l => (
              <TableRow key={l.id}>
                <TableCell>{new Date(l.createdAt).toLocaleString()}</TableCell>
                <TableCell>{l.action}</TableCell>
                <TableCell>{l.targetType}{l.targetId ? `:${l.targetId}` : ''}</TableCell>
                <TableCell className="max-w-[420px] truncate">{l.meta}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </Card>
    </div>
  );
}


