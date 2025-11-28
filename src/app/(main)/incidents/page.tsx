import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const incidents = [
  {
    id: "OC-001",
    title: "Lâmpada queimada no corredor do Bloco A",
    unit: "A-101",
    reporter: "João Silva",
    date: "21 de Julho, 2024",
    status: "Aberta",
  },
  {
    id: "OC-002",
    title: "Vazamento na garagem - Vaga 32",
    unit: "B-204",
    reporter: "Maria Oliveira",
    date: "20 de Julho, 2024",
    status: "Em Andamento",
  },
  {
    id: "OC-003",
    title: "Barulho excessivo após 22h",
    unit: "C-505",
    reporter: "Carlos Pereira",
    date: "19 de Julho, 2024",
    status: "Resolvida",
  },
  {
    id: "OC-004",
    title: "Portão da garagem não fecha",
    unit: "Síndico",
    reporter: "Portaria",
    date: "18 de Julho, 2024",
    status: "Resolvida",
  },
    {
    id: "OC-005",
    title: "Elevador social com barulho estranho",
    unit: "A-302",
    reporter: "Ana Souza",
    date: "17 de Julho, 2024",
    status: "Aberta",
  },
]

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Aberta: "destructive",
  "Em Andamento": "default",
  Resolvida: "secondary",
}


export default function IncidentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Ocorrências</h1>
          <p className="text-muted-foreground">Registre e acompanhe os chamados do condomínio.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Registrar Ocorrência
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Ocorrências</CardTitle>
          <CardDescription>Lista de todas as ocorrências registradas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Ações</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-medium">{incident.id}</TableCell>
                  <TableCell>{incident.title}</TableCell>
                  <TableCell>{incident.unit}</TableCell>
                  <TableCell>{incident.date}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[incident.status] || "outline"}>{incident.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Alterar Status</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
