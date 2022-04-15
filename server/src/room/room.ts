import { Socket } from "socket.io"
import { UnknownPlayer } from "../player/unknown-player"
import { PlayerToken, Question, RoomInfo, Serializer } from "@livechoice/common"
import { Player } from "../player/player"
import { Moderator } from "../player/moderator"

export class Room {
   playerTokens: PlayerToken[] = []
   questions: Question[] = []

   private players: Player[] = []
   moderator: Moderator

   constructor(public id: string, public name: string) {}

   public initModerator(client: Socket) {
      this.moderator = new Moderator(client, this)
      this.moderator.createdRoom()
   }

   public join(client: Socket) {
      if (this.moderator.is(client)) {
         this.moderator.joinedRoom()
         return
      }

      const unknownPlayer = new UnknownPlayer(client, this)
      unknownPlayer.requestAuthentication()
   }

   public addPlayer(player: Player) {
      this.players.push(player)
      player.joinedRoom()
   }

   public addToken(token: PlayerToken) {
      this.playerTokens.push(token)
      this.moderator.updateTokens()
   }

   public loadQuestions(input: string) {
      this.questions = Serializer.deserializeQuestions(input)
   }

   public getPlayerByToken(token: PlayerToken) {
      return this.players.find(player => player.token === token)
   }

   public getInfo(): RoomInfo {
      return { id: this.id, name: this.name }
   }
}
