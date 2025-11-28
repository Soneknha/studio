'use client';
import { useState, useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { collection, doc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { UserPlus } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface AppUser {
  id: string;
  name?: string;
  email?: string;
  isAdmin: boolean;
}

export default function AdminUsersPage() {
  const firestore = useFirestore();
  const { user: adminUser } = useUser();
  const { toast } = useToast();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!firestore) return;
      setIsLoading(true);
      try {
        const usersCol = collection(firestore, 'users');
        const adminRolesCol = collection(firestore, 'roles_admin');

        const [userSnapshot, adminSnapshot] = await Promise.all([
          getDocs(usersCol),
          getDocs(adminRolesCol)
        ]);

        const adminIds = new Set(adminSnapshot.docs.map(d => d.id));

        const allUsers = userSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || 'N/A',
          email: doc.data().email || 'N/A',
          isAdmin: adminIds.has(doc.id),
        }));
        
        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          variant: "destructive",
          title: "Erro ao buscar usuários",
          description: "Não foi possível carregar a lista de usuários.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [firestore, toast]);

  const toggleAdmin = (user: AppUser) => {
    if (!firestore) return;
    const adminRoleRef = doc(firestore, 'roles_admin', user.id);
    if (user.isAdmin) {
      deleteDocumentNonBlocking(adminRoleRef);
      setUsers(users.map(u => u.id === user.id ? { ...u, isAdmin: false } : u));
      toast({
        title: "Permissão removida",
        description: `${user.name} não é mais um administrador.`,
      });
    } else {
      setDocumentNonBlocking(adminRoleRef, { uid: user.id }, {});
      setUsers(users.map(u => u.id === user.id ? { ...u, isAdmin: true } : u));
      toast({
        title: "Permissão concedida",
        description: `${user.name} agora é um administrador.`,
      });
    }
  };

  const addSelfAsSindico = () => {
    if (!firestore || !adminUser) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Usuário administrador ou Firestore não encontrado.' });
        return;
    }
    const condominiumId = "condo-connect-123";
    const roleId = `${adminUser.uid}_${condominiumId}`;

    const batch = writeBatch(firestore);

    // 1. Create/update user document
    const userRef = doc(firestore, 'users', adminUser.uid);
    batch.set(userRef, {
        id: adminUser.uid,
        name: adminUser.displayName || 'Admin User',
        email: adminUser.email,
    }, { merge: true });
    
    // 2. Create the role document
    const roleRef = doc(firestore, 'usuarios_roles', roleId);
    batch.set(roleRef, {
        userId: adminUser.uid,
        condominiumId: condominiumId,
        role: "sindico",
    });

    batch.commit().then(() => {
        toast({
            title: "Sucesso!",
            description: "Você foi adicionado como síndico do condomínio de teste.",
        });
    }).catch(error => {
        const permissionError = new FirestorePermissionError({
          path: `batch write for test sindico role`,
          operation: 'write',
          requestResourceData: { 
            userDoc: { name: adminUser.displayName, email: adminUser.email },
            roleDoc: { userId: adminUser.uid, role: 'sindico' }
          }
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  };

  return (
    <div className="flex flex-col gap-8">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Gerenciar Usuários</h1>
          <p className="text-muted-foreground">Promova ou remova permissões de administrador.</p>
        </div>
        <Button onClick={addSelfAsSindico}>
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar-se como Síndico de Teste
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Todos os Usuários</CardTitle>
          <CardDescription>Lista de todos os usuários cadastrados no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Carregando...</TableCell>
                </TableRow>
              ) : users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <Badge>Admin</Badge>
                    ) : (
                      <Badge variant="secondary">Morador</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={user.isAdmin ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => toggleAdmin(user)}
                    >
                      {user.isAdmin ? 'Remover Admin' : 'Tornar Admin'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
