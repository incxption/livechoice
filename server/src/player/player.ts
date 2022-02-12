import { Socket } from "socket.io"
import { Room } from "../room/room"
import { PlayerToken } from "./player-token"

export type PlayerProperties = {
   name: string
}

export class Player {
   constructor(
      private client: Socket,
      private room: Room,
      public token: PlayerToken,
      private properties: PlayerProperties
   ) {}

   public joinedRoom() {
      this.token.used = true

      this.client.emit("room:joined", { roomId: this.room.id })
      this.client.emit("player:properties", this.properties)

      this.client.on("disconnect", () => this.disconnected())
   }

   public reconnectedRoom(newClient: Socket) {
      this.client = newClient
      this.joinedRoom()
   }

   public disconnected() {
      this.token.used = false
   }
}
