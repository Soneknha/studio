import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlaceHolderImages } from "@/lib/placeholder-images"

const bbqImage = PlaceHolderImages.find(p => p.id === 'amenity-bbq');
const partyRoomImage = PlaceHolderImages.find(p => p.id === 'amenity-party-room');
const poolImage = PlaceHolderImages.find(p => p.id === 'amenity-pool');


export default function ReservationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Reservas de Áreas Comuns</h1>
        <p className="text-muted-foreground">Agende o uso da churrasqueira, salão de festas e mais.</p>
      </div>

      <Tabs defaultValue="bbq">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="bbq">Churrasqueira</TabsTrigger>
          <TabsTrigger value="party-room">Salão de Festas</TabsTrigger>
          <TabsTrigger value="pool">Piscina</TabsTrigger>
        </TabsList>
        <TabsContent value="bbq">
          <Card>
            <CardHeader>
              <CardTitle>Churrasqueira Gourmet</CardTitle>
              <CardDescription>Perfeita para confraternizações. Capacidade para 20 pessoas.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
              {bbqImage && <Image
                src={bbqImage.imageUrl}
                alt="Churrasqueira"
                width={600}
                height={400}
                className="rounded-lg object-cover"
                data-ai-hint={bbqImage.imageHint}
              />}
              <div className="flex justify-center items-center">
                <Calendar
                  mode="single"
                  className="rounded-md border"
                />
              </div>
            </CardContent>
             <CardFooter>
              <Button>Reservar Churrasqueira</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="party-room">
          <Card>
            <CardHeader>
              <CardTitle>Salão de Festas</CardTitle>
              <CardDescription>Espaço amplo para eventos e festas. Capacidade para 80 pessoas.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
              {partyRoomImage && <Image
                src={partyRoomImage.imageUrl}
                alt="Salão de Festas"
                width={600}
                height={400}
                className="rounded-lg object-cover"
                data-ai-hint={partyRoomImage.imageHint}
              />}
              <div className="flex justify-center items-center">
                <Calendar
                  mode="single"
                  className="rounded-md border"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Reservar Salão de Festas</Button>
            </CardFooter>
          </Card>
        </TabsContent>
         <TabsContent value="pool">
          <Card>
            <CardHeader>
              <CardTitle>Piscina e Deck</CardTitle>
              <CardDescription>Área de lazer com piscina para adultos e crianças.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
              {poolImage && <Image
                src={poolImage.imageUrl}
                alt="Piscina"
                width={600}
                height={400}
                className="rounded-lg object-cover"
                data-ai-hint={poolImage.imageHint}
              />}
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                 <h3 className="font-semibold text-lg">Acesso Livre</h3>
                 <p className="text-muted-foreground">Não é necessário agendamento para uso da piscina. Horário de funcionamento: 08:00 às 22:00.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
