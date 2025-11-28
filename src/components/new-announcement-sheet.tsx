'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFirestore } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(5, { message: "O título deve ter pelo menos 5 caracteres." }),
  body: z.string().min(10, { message: "O corpo do aviso deve ter pelo menos 10 caracteres." }),
});

interface NewAnnouncementSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  condominiumId: string;
  userId?: string;
  userName?: string | null;
}

export function NewAnnouncementSheet({
  isOpen,
  setIsOpen,
  condominiumId,
  userId,
  userName,
}: NewAnnouncementSheetProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!firestore || !userId) {
        toast({
            variant: "destructive",
            title: "Erro de autenticação",
            description: "Você precisa estar logado para criar um aviso.",
        });
        return;
    }

    try {
      const announcementsCol = collection(firestore, `condominiums/${condominiumId}/announcements`);
      await addDoc(announcementsCol, {
        ...values,
        createdBy: userName || "Usuário desconhecido",
        createdById: userId,
        createdAt: serverTimestamp(),
        target: "condominium", // Default target for now
      });

      toast({
        title: "Aviso criado com sucesso!",
        description: "O comunicado já está visível para os moradores.",
      });
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar aviso",
        description: "Não foi possível salvar o comunicado. Tente novamente.",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Criar Novo Aviso</SheetTitle>
          <SheetDescription>
            Escreva um comunicado para todos os moradores do condomínio.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Manutenção da Piscina" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comunicado</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o aviso em detalhes aqui."
                      className="resize-none"
                      rows={10}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Salvando..." : "Salvar Aviso"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
