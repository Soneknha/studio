'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

// Define a type for the announcement data
type Announcement = {
  id: string;
  title: string;
  body: string;
  createdBy: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

// Mock condominiumId, will be dynamic in the future
const CONDOMINIUM_ID = "condo-connect-123";

export default function AnnouncementsPage() {
  const firestore = useFirestore();

  // Memoize the query to prevent re-renders
  const announcementsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, `condominiums/${CONDOMINIUM_ID}/announcements`),
      orderBy("createdAt", "desc")
    );
  }, [firestore]);

  const { data: announcements, isLoading } = useCollection<Omit<Announcement, 'id'>>(announcementsQuery);

  const formatDate = (timestamp: Announcement['createdAt']) => {
    if (!timestamp) return 'Data indisponível';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Avisos Gerais</h1>
          <p className="text-muted-foreground">Comunicados importantes para todos os moradores.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Aviso
        </Button>
      </div>

      <div className="grid gap-6">
        {isLoading && (
          <>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardContent>
            </Card>
          </>
        )}

        {!isLoading && announcements && announcements.length === 0 && (
          <Card className="flex flex-col items-center justify-center py-12">
            <CardHeader className="text-center">
              <CardTitle>Nenhum aviso encontrado</CardTitle>
              <CardDescription>Ainda não há comunicados para exibir. Volte em breve!</CardDescription>
            </CardHeader>
          </Card>
        )}

        {!isLoading && announcements && announcements.map((announcement) => (
          <Card key={announcement.id}>
            <CardHeader>
              <CardTitle>{announcement.title}</CardTitle>
              <CardDescription>
                Postado por {announcement.createdBy} em {formatDate(announcement.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">{announcement.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
