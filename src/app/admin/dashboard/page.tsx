'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Building, ShieldCheck, Users } from 'lucide-react';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import { Skeleton } from '@/components/ui/skeleton';

interface Condominium {
  id: string;
  name: string;
  address: string;
}

// Mock data until we have a form to create condominiums
const mockCondominiums: Condominium[] = [
    {
        id: 'condo-connect-123',
        name: 'CondoConnect Towers',
        address: 'Rua dos Desenvolvedores, 123 - São Paulo, SP'
    }
];


export default function AdminDashboardPage() {
  const firestore = useFirestore();

  // We keep the real queries for users and admins
  const usersQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'users') : null),
    [firestore]
  );
  const adminsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'roles_admin') : null),
    [firestore]
  );

  // For now, let's use the mock data for condominiums
  const condominiums = mockCondominiums;
  const isLoadingCondos = false; // We are not loading from the DB for now

  const { data: users, isLoading: isLoadingUsers } = useCollection(usersQuery);
  const { data: admins, isLoading: isLoadingAdmins } = useCollection(adminsQuery);

  const totalCondos = condominiums?.length ?? 0;
  const totalUsers = users?.length ?? 0;
  const totalAdmins = admins?.length ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          Painel do Administrador
        </h1>
        <p className="text-muted-foreground">
          Visão geral e gerenciamento do sistema.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Condomínios
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingCondos ? <Skeleton className="h-8 w-10" /> : totalCondos}
            </div>
            <p className="text-xs text-muted-foreground">gerenciados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Usuários
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingUsers ? <Skeleton className="h-8 w-10" /> : totalUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              em todos os condomínios
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Administradores
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingAdmins ? <Skeleton className="h-8 w-10" /> : totalAdmins}
            </div>
            <p className="text-xs text-muted-foreground">com acesso total</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Condomínios Ativos</CardTitle>
          <CardDescription>
            Lista de condomínios gerenciados pelo sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Condomínio</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingCondos && (
                <TableRow>
                   <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                   <TableCell><Skeleton className="h-5 w-64" /></TableCell>
                   <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                </TableRow>
              )}
              {!isLoadingCondos && condominiums && condominiums.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Nenhum condomínio cadastrado.
                  </TableCell>
                </TableRow>
              )}
              {!isLoadingCondos &&
                condominiums &&
                condominiums.map((condo) => (
                  <TableRow key={condo.id}>
                    <TableCell className="font-medium">{condo.name}</TableCell>
                    <TableCell>{condo.address}</TableCell>
                    <TableCell className="font-mono text-xs">{condo.id}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
