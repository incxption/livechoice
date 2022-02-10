import { Injectable } from "@angular/core"
import { Socket } from "ngx-socket-io"

@Injectable({
   providedIn: "root"
})
export class ChatService {
   constructor(private socket: Socket) {}

   sendChat(message: string) {
      this.socket.emit("chat", message)
   }

   getChat() {
      return this.socket.fromEvent<string>("chat")
   }

   getUsers() {
      return this.socket.fromEvent<number>("users")
   }
}
