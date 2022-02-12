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
      private token: PlayerToken,
      private properties: PlayerProperties
   ) {}

   public joinedRoom() {
      this.token.used = true
      this.client.emit("room:joined", { roomId: this.room.id })
      this.client.emit("player:properties", this.properties)
   }
}
