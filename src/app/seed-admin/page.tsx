'use client';

import { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const ADMIN_EMAIL = 'treecommunity@treetechautomation.com';
const ADMIN_UID = 'Z2mybdpXJEclRWCSVEFPKVw3x7T2';
const ADMIN_NAME = 'Tree Community';

export default function SeedAdminPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const seedAdminUser = async () => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Firestore não está disponível.',
      });
      return;
    }
    setIsLoading(true);
    setResult('');

    try {
      const userRef = doc(firestore, 'users', ADMIN_UID);
      const adminRoleRef = doc(firestore, 'roles_admin', ADMIN_UID);

      // 1. Check and create user document
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          id: ADMIN_UID,
          name: ADMIN_NAME,
          email: ADMIN_EMAIL,
        });
        setResult(prev => prev + `Documento de usuário para ${ADMIN_NAME} criado com sucesso.\n`);
      } else {
        setResult(prev => prev + `Documento de usuário para ${ADMIN_NAME} já existe.\n`);
      }

      // 2. Check and create admin role document
      const adminDoc = await getDoc(adminRoleRef);
      if (!adminDoc.exists()) {
        await setDoc(adminRoleRef, { uid: ADMIN_UID });
        setResult(prev => prev + 'Permissão de administrador concedida com sucesso.\n');
      } else {
        setResult(prev => prev + 'Usuário já possui permissão de administrador.\n');
      }

      toast({
        title: 'Operação Concluída',
        description: 'O usuário administrador foi configurado.',
      });
    } catch (error: any) {
      console.error('Error seeding admin user:', error);
      setResult(`Ocorreu um erro: ${error.message}`);
      toast({
        variant: 'destructive',
        title: 'Erro ao configurar administrador',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Configurar Administrador Inicial</CardTitle>
          <CardDescription>
            Clique no botão para criar o usuário administrador inicial com os
            seguintes dados:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm">
            <p><strong>Nome:</strong> {ADMIN_NAME}</p>
            <p><strong>Email:</strong> {ADMIN_EMAIL}</p>
            <p><strong>UID:</strong> {ADMIN_UID}</p>
          </div>
          <Button onClick={seedAdminUser} disabled={isLoading} className="w-full">
            {isLoading ? 'Configurando...' : 'Tornar Administrador'}
          </Button>
          {result && (
            <pre className="mt-4 w-full rounded-md bg-muted p-4 text-sm">
              {result}
            </pre>
          )}
        </CardContent>
         <CardFooter>
            <Button variant="outline" className="w-full" asChild>
                <Link href="/admin/users">Voltar para Gerenciar Usuários</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
