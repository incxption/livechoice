import {
   OnGatewayConnection,
   OnGatewayDisconnect,
   SubscribeMessage,
   WebSocketGateway
} from "@nestjs/websockets"
import { Logger } from "@nestjs/common"
import { Socket } from "socket.io"
import { RoomService } from "./room.service"

/**
 * Handles socket connections to game rooms.
 */
@WebSocketGateway({ cors: { origin: "*" } })
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
   constructor(private roomService: RoomService) {}

   /**
    * The logger used by this class.
    */
   private readonly logger = new Logger("RoomGateway")

   /**
    * Called when a socket connection is made.
    */
   handleConnection(client: Socket): any {
      this.logger.log(`Client '${client.id}' connected`)
   }

   /**
    * Called when a socket disconnects.
    */
   handleDisconnect(client: Socket): any {
      this.logger.log(`Client '${client.id}' disconnected`)
   }

   /**
    * Handles the request of a player to join a room.
    */
   @SubscribeMessage("room:join")
   async onJoin(client: Socket, roomId: string): Promise<void> {
      this.roomService.joinRoom(client, roomId)
   }
}
