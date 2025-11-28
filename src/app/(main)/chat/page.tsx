
'use client';

import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendHorizonal, Paperclip, Bot } from "lucide-react"
import { chat } from "@/ai/flows/chat-flow";

const contacts = [
  { name: "Síndico IA", message: "Olá! Como posso ajudar?", avatar: "IA", active: true, isBot: true },
  { name: "Administração", message: "Claro, vamos verificar.", avatar: "AD" },
  { name: "Portaria", message: "Recebido, liberando acesso.", avatar: "PO" },
  { name: "João Silva (A-101)", message: "Obrigado!", avatar: "JS" },
  { name: "Maria Oliveira (B-204)", message: "Ok, vou verificar e retorno.", avatar: "MO" },
  { name: "Grupo - Bloco A", message: "Pessoal, alguém tem uma...", avatar: "GA" },
]

type Message = {
    from: "me" | "other";
    text: string;
    time: string;
};

const initialMessages: Message[] = [
    { from: "other", text: "Olá! Sou o Síndico IA. Como posso te ajudar hoje com as questões do condomínio?", time: "10:30" },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getTime = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { from: 'me', text: input, time: getTime() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.from === 'me' ? 'user' : 'model',
        content: [{ text: m.text }],
      }));
      const response = await chat(history, userMessage.text);
      
      const aiMessage: Message = { from: 'other', text: response, time: getTime() };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling AI chat:", error);
      const errorMessage: Message = { from: 'other', text: "Desculpe, não consegui processar sua mensagem. Tente novamente.", time: getTime() };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

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
                  <AvatarFallback>{contact.isBot ? <Bot className="h-5 w-5" /> : contact.avatar}</AvatarFallback>
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
                <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
            </Avatar>
             <div>
                 <p className="font-semibold">Síndico IA</p>
                 <p className="text-sm text-green-500">Online</p>
            </div>
          </div>
          <ScrollArea className="flex-1 p-4 bg-muted/20">
            <div className="flex flex-col gap-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.from === 'me' ? 'justify-end' : ''}`}>
                         {msg.from === 'other' && <Avatar className="h-8 w-8"><AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback></Avatar>}
                        <div className={`max-w-xs lg:max-w-xl p-3 rounded-lg ${msg.from === 'me' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.from === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                  <div className="flex items-end gap-2">
                    <Avatar className="h-8 w-8"><AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback></Avatar>
                    <div className="max-w-xs lg:max-w-md p-3 rounded-lg bg-background">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-0"></span>
                        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-150"></span>
                        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-300"></span>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="p-4 border-t bg-background">
            <div className="relative">
              <Input
                placeholder="Converse com o Síndico IA..."
                className="pr-24"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                 <Button variant="ghost" size="icon" type="button">
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" type="submit" disabled={isLoading}>
                    <SendHorizonal className="h-5 w-5 text-primary" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
