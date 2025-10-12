import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Member } from "@/db/schema";
import MembersTableAction from "./members-table-action";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface MembersTableProps {
  members: Member[];
}

export default function MembersTable({ members }: MembersTableProps) {
  if (!members || members.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon" />
          <EmptyTitle>No members yet</EmptyTitle>
          <EmptyDescription>Invite your team to collaborate on secrets.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }
  
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableCaption>A list of organization members.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.user.name}</TableCell>
                <TableCell>{member.user.email}</TableCell>
                <TableCell>
                  <Badge variant={member.role === "owner" ? "default" : "secondary"}>
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <MembersTableAction memberId={member.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {members.map((member) => (
          <Card key={member.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="font-medium">{member.user.name}</div>
                <div className="text-sm text-muted-foreground">{member.user.email}</div>
                <Badge variant={member.role === "owner" ? "default" : "secondary"} className="mt-2">
                  {member.role}
                </Badge>
              </div>
              <MembersTableAction memberId={member.id} />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
