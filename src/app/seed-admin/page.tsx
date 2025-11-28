
'use client';

import { useState } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Emitter para erros detalhados (simplificado para o console do navegador)
const errorEmitter = {
  emit: (error: any, context: string) => {
    console.error(`🔴 ERRO EM: ${context}`, {
      error,
      message: error.message,
      timestamp: new Date().toISOString(),
      user: typeof window !== 'undefined' ? localStorage.getItem('userEmail') : 'unknown'
    });
  }
};

export default function SeedAdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { user } = useUser();
  const firestore = useFirestore();

  const seedAdmin = async () => {
    if (!firestore) {
      setError('Firestore não está disponível');
      return;
    }
    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const adminUid = "Z2mybdpXJEclRWCSVEFPKVw3x7T2";
      
      console.log('👤 Usuário atual:', {
        uid: user.uid,
        email: user.email,
        isAuthenticated: !!user
      });

      try {
        await getDoc(doc(firestore, 'roles_admin', 'test_permission'));
        console.log('✅ Permissão de leitura em roles_admin: OK');
      } catch (readError: any) {
        errorEmitter.emit(readError, 'TEST_READ_PERMISSION');
        console.error('❌ Sem permissão de leitura em roles_admin:', readError);
      }

      let adminExists = false;
      try {
        const adminDoc = await getDoc(doc(firestore, 'roles_admin', adminUid));
        adminExists = adminDoc.exists();
        console.log('📊 Admin existe?', adminExists);
      } catch (checkError: any) {
        errorEmitter.emit(checkError, 'CHECK_ADMIN_EXISTS');
        throw new Error(`Falha ao verificar admin: ${checkError.message}`);
      }

      if (adminExists) {
        setMessage('✅ Admin já está configurado!');
        setLoading(false);
        return;
      }

      try {
        await setDoc(doc(firestore, 'roles_admin', adminUid), {
          email: 'treecommunity@treetechautomation.com',
          isAdmin: true,
          name: 'Tree Community Admin',
          createdAt: new Date(),
          createdBy: user.uid
        });
        
        setMessage('✅ Admin configurado com sucesso!');
        console.log('🎉 Admin criado com sucesso!');
        
      } catch (writeError: any) {
        errorEmitter.emit(writeError, 'CREATE_ADMIN_DOCUMENT');
        throw new Error(`Falha ao criar admin: ${writeError.message}`);
      }

    } catch (err: any) {
      const errorMessage = `Erro detalhado: ${err.message}`;
      setError(errorMessage);
      errorEmitter.emit(err, 'SEED_ADMIN_PROCESS');
    } finally {
      setLoading(false);
    }
  };

  const testPermissions = async () => {
    if (!firestore || !user) {
        setError("Usuário ou Firestore não disponível para teste.");
        return;
    }
    try {
      setMessage('Testando permissões...');
      
      const tests = [
        { name: 'Leitura_users', action: () => getDoc(doc(firestore, 'users', user.uid)) },
        { name: 'Leitura_roles_admin', action: () => getDoc(doc(firestore, 'roles_admin', 'test')) },
        { name: 'Escrita_roles_admin', action: () => setDoc(doc(firestore, 'roles_admin', 'test_write'), { test: true }) }
      ];

      for (const test of tests) {
        try {
          await test.action();
          console.log(`✅ ${test.name}: PERMITIDO`);
        } catch (testError: any) {
          console.log(`❌ ${test.name}: NEGADO`, testError.message);
          errorEmitter.emit(testError, `TEST_${test.name.toUpperCase()}`);
        }
      }

      setMessage('Teste de permissões completo! Verifique o console.');
    } catch (err: any) {
      setError(`Erro no teste: ${err.message}`);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex justify-center items-center min-h-screen bg-muted/20">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Configurar Administrador</CardTitle>
          <CardDescription>
            Use esta página para configurar o usuário administrador inicial e testar permissões.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm p-4 bg-secondary rounded-md border">
            <p><strong>Usuário Atual:</strong> {user?.email || 'Carregando...'}</p>
            <p><strong>UID:</strong> {user?.uid || 'Carregando...'}</p>
            <p className="mt-2"><strong>Admin UID Alvo:</strong> Z2mybdpXJEclRWCSVEFPKVw3x7T2</p>
          </div>

          {message && (
            <div className="p-3 bg-green-100 text-green-800 rounded-md border border-green-200">
              {message}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-100 text-red-800 rounded-md border border-red-200">
              <p className='font-bold'>Ocorreu um erro:</p>
              <p className='text-sm'>{error}</p>
            </div>
          )}

           <div className="mt-4 text-sm text-muted-foreground">
                <h3 className="font-bold mb-2">Instruções:</h3>
                <ol className="list-decimal list-inside space-y-1">
                <li>Abra o console do seu navegador (F12 ou Ctrl+Shift+I).</li>
                <li>Clique em "Testar Permissões" para uma verificação inicial.</li>
                <li>Clique em "Configurar Admin" para tentar criar o registro de administrador.</li>
                <li>Observe a saída no console e compartilhe quaisquer erros vermelhos (🔴).</li>
                </ol>
            </div>

        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button
                onClick={testPermissions}
                variant="outline"
                className="w-full"
            >
                Testar Permissões
            </Button>
            <Button
                onClick={seedAdmin}
                disabled={loading}
                className="w-full"
            >
                {loading ? 'Configurando...' : 'Configurar Admin'}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
