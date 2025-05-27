
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserRoleBadge } from "./UserRoleBadge";
import { StatusBadge } from "./StatusBadge";
import { type UserProfile } from "@/hooks/useUsersList";

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
          <TableHead>ID Utilisateur</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Ville</TableHead>
          <TableHead>Date d'inscription</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10">
              Aucun utilisateur trouvé
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                  {user.birthDate && (
                    <div className="text-sm text-gray-500">
                      Né(e) le {new Date(user.birthDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-mono text-xs">
                  {user.id.substring(0, 8)}...
                </div>
              </TableCell>
              <TableCell>
                {user.phoneNumber || "Non renseigné"}
              </TableCell>
              <TableCell>
                {user.city ? `${user.city} ${user.postalCode}` : "Non renseigné"}
              </TableCell>
              <TableCell>
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
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
