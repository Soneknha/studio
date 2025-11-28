import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendHorizonal, Paperclip } from "lucide-react"

const contacts = [
  { name: "Administração", message: "Claro, vamos verificar.", avatar: "AD", active: true },
  { name: "Portaria", message: "Recebido, liberando acesso.", avatar: "PO" },
  { name: "João Silva (A-101)", message: "Obrigado!", avatar: "JS" },
  { name: "Maria Oliveira (B-204)", message: "Ok, vou verificar e retorno.", avatar: "MO" },
  { name: "Grupo - Bloco A", message: "Pessoal, alguém tem uma...", avatar: "GA" },
]

const messages = [
    { from: "me", text: "Bom dia, gostaria de reportar um vazamento na minha vaga de garagem, a de número 32.", time: "10:30" },
    { from: "other", text: "Bom dia, Sra. Maria. Recebido. Estamos enviando a equipe de manutenção para verificar.", time: "10:31" },
    { from: "other", text: "Poderia nos confirmar se há alguém na unidade B-204 para acompanhar?", time: "10:31" },
    { from: "me", text: "Sim, meu marido está em casa e pode acompanhar.", time: "10:33" },
    { from: "other", text: "Perfeito, equipe a caminho. Manteremos informada.", time: "10:34" },
]

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-8.5rem)]">
      <Card className="h-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <div className="border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Conversas</h2>
          </div>
          <ScrollArea className="flex-1">
            {contacts.map((contact, index) => (
              <div key={index} className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 ${contact.active ? 'bg-muted' : ''}`}>
                <Avatar>
                  <AvatarFallback>{contact.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="font-semibold truncate">{contact.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{contact.message}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col">
          <div className="p-4 border-b flex items-center gap-3">
             <Avatar>
                <AvatarFallback>AD</AvatarFallback>
            </Avatar>
             <div>
                 <p className="font-semibold">Administração</p>
                 <p className="text-sm text-green-500">Online</p>
            </div>
          </div>
          <ScrollArea className="flex-1 p-4 bg-muted/20">
            <div className="flex flex-col gap-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.from === 'me' ? 'justify-end' : ''}`}>
                         {msg.from === 'other' && <Avatar className="h-8 w-8"><AvatarFallback>AD</AvatarFallback></Avatar>}
                        <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.from === 'me' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                            <p>{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.from === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</p>
                        </div>
                    </div>
                ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-background">
            <div className="relative">
              <Input placeholder="Digite sua mensagem..." className="pr-24" />
              <div className="absolute inset-y-0 right-0 flex items-center">
                 <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon">
                    <SendHorizonal className="h-5 w-5 text-primary" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
