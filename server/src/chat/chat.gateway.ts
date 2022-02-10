import {
   OnGatewayConnection,
   OnGatewayDisconnect,
   SubscribeMessage,
   WebSocketGateway,
   WebSocketServer
} from "@nestjs/websockets"
import { Logger } from "@nestjs/common"

@WebSocketGateway({ cors: { origin: "*" } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
   private readonly logger = new Logger(ChatGateway.name)

   @WebSocketServer() server
   users: number = 0

   constructor() {}

   async handleConnection(client) {
      this.users++
      this.logger.log(`Client connected: ${client.id}`)
      this.server.emit("users", this.users)
   }

   async handleDisconnect(client) {
      this.users--
      this.logger.log(`Client disconnected: ${client.id}`)
      this.server.emit("users", this.users)
   }

   @SubscribeMessage("chat")
   async onChat(client, message) {
      client.broadcast.emit("chat", message)
   }
}
