import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Calendar,
  Megaphone,
  ShieldAlert,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DashboardChart } from "@/components/dashboard-chart"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Bem-vindo(a) de volta!</h1>
        <p className="text-muted-foreground">Aqui está um resumo do seu condomínio.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Moradores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">482</div>
            <p className="text-xs text-muted-foreground">em 210 unidades</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Este Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+35</div>
            <p className="text-xs text-muted-foreground">+10.2% desde o mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocorrências Abertas</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 novas hoje</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Aviso</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold leading-tight">Manutenção da Piscina</div>
            <p className="text-xs text-muted-foreground">Postado em 20 de Julho</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Reservas de Áreas Comuns</CardTitle>
            <CardDescription>Uso das áreas comuns nos últimos 6 meses.</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avisos Recentes</CardTitle>
            <CardDescription>Fique por dentro das últimas notícias do condomínio.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Festa Junina do Condomínio</p>
                  <p className="text-sm text-muted-foreground">Não perca nosso arraiá no dia 29/06!</p>
                </div>
              </li>
               <li className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Nova Regra de Lixo</p>
                  <p className="text-sm text-muted-foreground">Separar orgânicos e recicláveis é obrigatório.</p>
                </div>
              </li>
               <li className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Vaga de Garagem Visitantes</p>
                  <p className="text-sm text-muted-foreground">Novas regras para uso das vagas de visitantes.</p>
                </div>
              </li>
            </ul>
             <Button asChild className="mt-4 w-full">
                <Link href="/announcements">Ver todos os avisos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
