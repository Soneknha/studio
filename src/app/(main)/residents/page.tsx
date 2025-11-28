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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const residents = [
  {
    name: "João da Silva",
    avatar: "JS",
    unit: "A-101",
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321",
    vehicle: "Honda Civic | ABC-1234",
    status: "Adimplente",
  },
  {
    name: "Maria Oliveira",
    avatar: "MO",
    unit: "B-204",
    email: "maria.o@email.com",
    phone: "(21) 91234-5678",
    vehicle: "Toyota Corolla | XYZ-5678",
    status: "Adimplente",
  },
  {
    name: "Carlos Pereira",
    avatar: "CP",
    unit: "C-505",
    email: "carlos.p@email.com",
    phone: "(31) 98888-7777",
    vehicle: "N/A",
    status: "Inadimplente",
  },
  {
    name: "Ana Souza",
    avatar: "AS",
    unit: "A-302",
    email: "ana.souza@email.com",
    phone: "(41) 99999-8888",
    vehicle: "Hyundai Creta | QWE-9876",
    status: "Adimplente",
  },
];

const statusVariant: { [key: string]: "secondary" | "destructive" } = {
  Adimplente: "secondary",
  Inadimplente: "destructive",
};

export default function ResidentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Moradores</h1>
          <p className="text-muted-foreground">Gerencie as informações dos moradores e unidades.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Morador
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Moradores</CardTitle>
          <CardDescription>Total de {residents.length} moradores cadastrados.</CardDescription>
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
                <TableHead><span className="sr-only">Ações</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {residents.map((resident, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{resident.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>{resident.name}</span>
                        <span className="text-xs text-muted-foreground">{resident.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{resident.unit}</TableCell>
                  <TableCell>{resident.phone}</TableCell>
                  <TableCell>{resident.vehicle}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[resident.status]}>{resident.status}</Badge>
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
                        <DropdownMenuItem className="text-destructive">Remover</DropdownMenuItem>
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
  );
}
