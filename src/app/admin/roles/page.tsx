'use client';
import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AppUser {
  id: string;
  name?: string;
  email?: string;
}

interface Condominium {
  id: string;
  name: string;
}

interface UserRole {
  id: string;
  userId: string;
  condominiumId: string;
  role: string;
}

const availableRoles = ['sindico', 'porteiro', 'morador'];

export default function ManageRolesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedCondo, setSelectedCondo] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');

  const usersQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'users') : null),
    [firestore]
  );
  const condosQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'condominios') : null),
    [firestore]
  );
  const rolesQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'usuarios_roles') : null),
    [firestore]
  );

  const { data: users, isLoading: isLoadingUsers } =
    useCollection<AppUser>(usersQuery);
  const { data: condominiums, isLoading: isLoadingCondos } =
    useCollection<Condominium>(condosQuery);
  const { data: roles, isLoading: isLoadingRoles } =
    useCollection<UserRole>(rolesQuery);

  const handleAssignRole = () => {
    if (!firestore || !selectedUser || !selectedCondo || !selectedRole) {
      toast({
        variant: 'destructive',
        title: 'Seleção incompleta',
        description: 'Por favor, selecione um usuário, condomínio e função.',
      });
      return;
    }

    const roleId = `${selectedUser}_${selectedCondo}`;
    const roleRef = doc(firestore, 'usuarios_roles', roleId);
    const roleData = {
      userId: selectedUser,
      condominiumId: selectedCondo,
      role: selectedRole,
    };

    setDocumentNonBlocking(roleRef, roleData, { merge: true });

    toast({
      title: 'Função atribuída com sucesso!',
      description: `O usuário agora tem a função de ${selectedRole}.`,
    });
  };

  const getUserName = (userId: string) => users?.find(u => u.id === userId)?.name || userId;
  const getCondoName = (condoId: string) => condominiums?.find(c => c.id === condoId)?.name || condoId;


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Gerenciar Funções</h1>
        <p className="text-muted-foreground">
          Atribua funções (síndico, porteiro) aos usuários para cada condomínio.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atribuir Nova Função</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Usuário</label>
            <Select onValueChange={setSelectedUser} value={selectedUser}>
              <SelectTrigger disabled={isLoadingUsers}>
                <SelectValue placeholder="Selecione um usuário" />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Condomínio</label>
            <Select onValueChange={setSelectedCondo} value={selectedCondo}>
              <SelectTrigger disabled={isLoadingCondos}>
                <SelectValue placeholder="Selecione um condomínio" />
              </SelectTrigger>
              <SelectContent>
                {condominiums?.map((condo) => (
                  <SelectItem key={condo.id} value={condo.id}>
                    {condo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Função</label>
            <Select onValueChange={setSelectedRole} value={selectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAssignRole}>Atribuir Função</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Funções Atuais</CardTitle>
          <CardDescription>
            Lista de todas as funções de usuários nos condomínios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Condomínio</TableHead>
                <TableHead>Função</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isLoadingRoles || isLoadingUsers || isLoadingCondos) && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                </TableRow>
              )}
              {!isLoadingRoles && roles && roles.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Nenhuma função atribuída ainda.
                  </TableCell>
                </TableRow>
              )}
              {!isLoadingRoles && roles && roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{getUserName(role.userId)}</TableCell>
                  <TableCell>{getCondoName(role.condominiumId)}</TableCell>
                  <TableCell className="font-medium capitalize">{role.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
