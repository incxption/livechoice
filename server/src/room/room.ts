import { Socket } from "socket.io"
import { UnknownPlayer } from "../player/unknown-player"
import { PlayerToken } from "../player/player-token"
import { Player } from "../player/player"

export class Room {
   playerTokens: PlayerToken[] = [new PlayerToken("mogo", { name: "Moritz Gößl" })]

   private unknownPlayers: UnknownPlayer[] = []
   private players: Player[] = []

   constructor(public id: string) {}

   public join(client: Socket) {
      const unknownPlayer = new UnknownPlayer(client, this)
      this.unknownPlayers.push(unknownPlayer)
      unknownPlayer.requestAuthentication()
   }

   public addPlayer(player: Player) {
      this.players.push(player)
      player.joinedRoom()
   }

   public getPlayerByToken(token: PlayerToken) {
      return this.players.find(player => player.token === token)
   }
}
