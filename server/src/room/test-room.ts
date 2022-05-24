import { Room } from "./room"
import { Socket } from "socket.io"
import { PlayerToken } from "@livechoice/common"

export class TestRoom extends Room {
   constructor() {
      super("test", "Test-Raum")
   }

   public join(client: Socket) {
      if (!this.moderator) {
         this.initModerator(client)
         this.moderator.joinedRoom()

         client.on("disconnect", () => {
            this.moderator = undefined
         })

         setTimeout(() => {
            this.playerTokens = []

            for (let i = 1; i <= 5; i++) {
               this.addToken(new PlayerToken(random(), { name: "Spieler " + i }))
            }
         }, 500)
         return
      }

      const player = super.join(client)
      if (!player) return

      const token = this.playerTokens.find(t => !t.used)
      player.handleAuthenticationResponse(token.key)

      return player
   }
}

function random() {
   return Math.random().toString(16).slice(2, 6)
}
