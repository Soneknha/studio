import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

const announcements = [
  {
    id: 1,
    title: "Manutenção da Piscina",
    author: "Administração",
    date: "20 de Julho, 2024",
    content: "A piscina estará fechada para manutenção anual entre os dias 25 e 28 de Julho. Agradecemos a compreensão de todos.",
  },
  {
    id: 2,
    title: "Festa Junina do Condomínio",
    author: "Síndico",
    date: "15 de Junho, 2024",
    content: "Preparem a camisa xadrez! Nossa tradicional Festa Junina acontecerá no dia 29 de Junho, no salão de festas, a partir das 18h. Teremos comidas típicas, música e diversão para toda a família.",
  },
  {
    id: 3,
    title: "Atualização das Regras de Lixo",
    author: "Administração",
    date: "10 de Junho, 2024",
    content: "A partir de 1 de Julho, será obrigatória a separação de lixo orgânico e reciclável. Contentores específicos serão disponibilizados nas áreas designadas. Contamos com a colaboração de todos para um condomínio mais sustentável.",
  },
    {
    id: 4,
    title: "Controle de Acesso de Visitantes",
    author: "Portaria",
    date: "01 de Junho, 2024",
    content: "Para maior segurança, todos os visitantes deverão ser previamente autorizados pelos moradores através do aplicativo. Visitantes não autorizados não terão o acesso permitido.",
  },
]

export default function AnnouncementsPage() {
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
        {announcements.map((announcement) => (
          <Card key={announcement.id}>
            <CardHeader>
              <CardTitle>{announcement.title}</CardTitle>
              <CardDescription>
                Postado por {announcement.author} em {announcement.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">{announcement.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
