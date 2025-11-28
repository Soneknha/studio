'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFirestore } from '@/firebase';
import {
  addDoc,
  collection,
  doc,
  writeBatch,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  createUserWithEmailAndPassword,
  getAuth,
} from 'firebase/auth';

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  phone: z.string().optional(),
  unit: z.string().min(2, { message: 'A unidade é obrigatória.' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  status: z.enum(['Adimplente', 'Inadimplente']),
});

interface NewResidentSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  condominiumId: string;
}

export function NewResidentSheet({
  isOpen,
  setIsOpen,
  condominiumId,
}: NewResidentSheetProps) {
  const firestore = useFirestore();
  const auth = getAuth();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      unit: '',
      password: '',
      status: 'Adimplente',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Erro de conexão',
        description: 'Não foi possível conectar ao banco de dados.',
      });
      return;
    }

    try {
      // Create user in Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      // Create documents in Firestore within a batch
      const batch = writeBatch(firestore);

      const userRef = doc(firestore, 'users', user.uid);
      batch.set(userRef, {
        id: user.uid,
        name: values.name,
        email: values.email,
        phone: values.phone,
        condominiumIds: [condominiumId],
        roles: ['MORADOR'],
        unit: values.unit,
        status: values.status,
      });

      const condoMemberRef = doc(
        firestore,
        `condominiums/${condominiumId}/condominium_members`,
        user.uid
      );
      batch.set(condoMemberRef, {
        role: 'MORADOR',
      });
      
      // TODO: This is not ideal, we should have a better way to do this
      const unitRef = doc(firestore, `condominiums/${condominiumId}/units`, values.unit);
      batch.set(unitRef, {
        id: values.unit,
        condominiumId: condominiumId,
        blockId: values.unit.split('-')[0],
        number: values.unit.split('-')[1],
        residentIds: [user.uid],
       }, { merge: true });

      const unitResidentRef = doc(firestore, `condominiums/${condominiumId}/units/${values.unit}/unit_residents`, user.uid);
      batch.set(unitResidentRef, {
          userId: user.uid,
      });

      await batch.commit();

      toast({
        title: 'Morador adicionado com sucesso!',
        description: `${values.name} foi adicionado e um convite foi enviado.`,
      });
      form.reset();
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error creating resident:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar morador',
        description:
          error.code === 'auth/email-already-in-use'
            ? 'Este e-mail já está em uso por outra conta.'
            : error.message ||
              'Não foi possível adicionar o morador. Tente novamente.',
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Adicionar Novo Morador</SheetTitle>
          <SheetDescription>
            Insira os dados do novo morador. Uma conta de acesso será criada
            automaticamente.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do morador" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@exemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha de Acesso</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Senha temporária"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 90000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: A-101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Financeiro</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Adimplente">Adimplente</SelectItem>
                      <SelectItem value="Inadimplente">Inadimplente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? 'Salvando...'
                  : 'Salvar Morador'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
