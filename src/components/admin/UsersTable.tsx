
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserRoleBadge } from "./UserRoleBadge";
import { StatusBadge } from "./StatusBadge";

// Define our UserProfile type
export type UserProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string | null;
  email: string;
  role: "patient" | "medecin" | "institution";
  email_verified: boolean;
  terms_accepted: boolean;
};

type UsersTableProps = {
  users: UserProfile[];
  onViewDetails?: (userId: string) => void;
};

export function UsersTable({ users, onViewDetails }: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Email vérifié</TableHead>
          <TableHead>CGU acceptées</TableHead>
          <TableHead>Date d'inscription</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-10">
              Aucun utilisateur trouvé
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <UserRoleBadge role={user.role} />
              </TableCell>
              <TableCell>
                <StatusBadge status={user.email_verified} />
              </TableCell>
              <TableCell>
                <StatusBadge status={user.terms_accepted} />
              </TableCell>
              <TableCell>
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails && onViewDetails(user.id)}
                  className="text-directiveplus-600 border-directiveplus-200 hover:bg-directiveplus-50"
                >
                  Détails
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
