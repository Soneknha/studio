'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { NewResidentSheet } from '@/components/new-resident-sheet';

type Resident = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  unit?: string;
  vehicle?: string;
  status?: 'Adimplente' | 'Inadimplente';
};

const CONDOMINIUM_ID = 'condo-connect-123';

const statusVariant: { [key: string]: 'secondary' | 'destructive' } = {
  Adimplente: 'secondary',
  Inadimplente: 'destructive',
};

export default function ResidentsPage() {
  const firestore = useFirestore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const residentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'users'),
      where('condominiumIds', 'array-contains', CONDOMINIUM_ID)
    );
  }, [firestore]);

  const { data: residents, isLoading } = useCollection<Omit<Resident, 'id'>>(residentsQuery);

  const getInitials = (name: string) => {
    if (!name) return 'SR';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <NewResidentSheet
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        condominiumId={CONDOMINIUM_ID}
      />
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-headline">Moradores</h1>
            <p className="text-muted-foreground">
              Gerencie as informações dos moradores e unidades.
            </p>
          </div>
          <Button onClick={() => setIsSheetOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Morador
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Moradores</CardTitle>
            <CardDescription>
              Total de {residents?.length ?? 0} moradores cadastrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={`skl-${i}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="flex flex-col gap-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                )}
                {!isLoading && residents && residents.map((resident) => (
                  <TableRow key={resident.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {getInitials(resident.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span>{resident.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {resident.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{resident.unit || 'N/A'}</TableCell>
                    <TableCell>{resident.phone || 'N/A'}</TableCell>
                    <TableCell>{resident.vehicle || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[resident.status || 'Adimplente']}>
                        {resident.status || 'Adimplente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                 {!isLoading && residents?.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            Nenhum morador encontrado.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
