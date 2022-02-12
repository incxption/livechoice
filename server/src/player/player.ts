import { Socket } from "socket.io"
import { Room } from "../room/room"
import { PlayerProperties, PlayerToken } from "@livechoice/common"

export class Player {
   constructor(
      private client: Socket,
      private room: Room,
      public token: PlayerToken,
      private properties: PlayerProperties
   ) {}

   public joinedRoom() {
      this.token.used = true
      this.room.moderator.updateTokens()

      this.client.emit("room:joined", this.room.getInfo())
      this.client.emit("player:properties", this.properties)

      this.client.on("disconnect", () => this.disconnected())
   }

   public reconnectedRoom(newClient: Socket) {
      this.client = newClient
      this.joinedRoom()
   }

   public disconnected() {
      this.token.used = false
      this.room.moderator.updateTokens()
   }
}
