import { Socket } from "socket.io"
import { Room } from "../room/room"
import { PlayerProperties, PlayerToken, Question } from "livechoice-common"

export class Player {
   public lastQuestionResult = false
   public individualScores: number[] = []

   constructor(
      public client: Socket,
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
      this.room.moderator?.updateTokens()
      this.room.players.splice(this.room.players.indexOf(this), 1)
   }

   public promptQuestion(question: Question) {
      this.client.emit("question:prompt", question)
   }

   public sendAnswerResult() {
      this.client.emit("question:answer-result", this.lastQuestionResult)
   }

   public get totalScore(): number {
      return this.individualScores.reduce((a, b) => a + b, 0)
   }
}
