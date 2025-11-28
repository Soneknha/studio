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
import { FileText, Download, PlusCircle } from "lucide-react"

const documents = [
  {
    name: "Ata da Assembleia - 2024-05-15.pdf",
    type: "Ata de Assembleia",
    size: "1.2 MB",
    uploadedAt: "16 de Maio, 2024",
  },
  {
    name: "Regimento Interno Atualizado.pdf",
    type: "Regulamento",
    size: "850 KB",
    uploadedAt: "01 de Março, 2024",
  },
  {
    name: "Balanço Financeiro - Q1 2024.xlsx",
    type: "Financeiro",
    size: "450 KB",
    uploadedAt: "15 de Abril, 2024",
  },
  {
    name: "Manual do Morador.pdf",
    type: "Manual",
    size: "2.5 MB",
    uploadedAt: "10 de Janeiro, 2024",
  },
  {
    name: "Contrato de Manutenção - Elevadores.pdf",
    type: "Contrato",
    size: "980 KB",
    uploadedAt: "20 de Fevereiro, 2024",
  },
]

export default function DocumentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Documentos</h1>
          <p className="text-muted-foreground">Acesse atas, regulamentos e outros arquivos importantes.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Documento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Arquivos do Condomínio</CardTitle>
          <CardDescription>Lista de todos os documentos disponíveis para consulta e download.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Arquivo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Data de Upload</TableHead>
                <TableHead><span className="sr-only">Ações</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{doc.name}</span>
                  </TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell>{doc.uploadedAt}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
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
