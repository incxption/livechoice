import { Socket } from "socket.io"
import { Room } from "../room/room"
import { Player } from "./player"

export class UnknownPlayer {
   constructor(private client: Socket, private room: Room) {}

   public requestAuthentication() {
      this.client.on("room:authentication:response", (key: string) => {
         this.handleAuthenticationResponse(key)
      })
      this.client.emit("room:authentication:request")
   }

   private handleAuthenticationResponse(key: string) {
      const token = this.room.playerTokens.find(token => token.key === key)

      if (!token) {
         this.client.emit("room:authentication:error", "Der eingegebene Schlüssel ist ungültig.")
         return
      }

      if (token.used) {
         this.client.emit("room:authentication:error", "Der Schlüssel wurde bereits verwendet.")
         return
      }

      const existing = this.room.getPlayerByToken(token)
      if (existing) {
         existing.reconnectedRoom(this.client)
         return
      }

      const player = new Player(this.client, this.room, token, token.properties)
      this.room.addPlayer(player)
   }
}
