import { Socket } from "socket.io"
import { UnknownPlayer } from "../player/unknown-player"
import { isCorrect, PlayerToken, Question, RoomInfo, Serializer } from "@livechoice/common"
import { Player } from "../player/player"
import { Moderator } from "../player/moderator"
import { Logger } from "@nestjs/common"

export class Room {
   playerTokens: PlayerToken[] = []
   questions: Question[] = []
   questionIndex: number = 0

   players: Player[] = []
   moderator: Moderator

   private readonly logger = new Logger("Room " + this.name)

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

      return unknownPlayer
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

   public start() {
      this.questionIndex = 0
      this.activateQuestion(this.questions[0])
   }

   public nextQuestion() {
      this.logger.log("Moving on to next question...")

      // send results to all players
      for (const player of this.players) {
         player.sendAnswerResult()
      }

      this.questionIndex++
      if (this.questionIndex >= this.questions.length) {
         // game has ended
      }

      // display leaderboard before next question?
      // this.activateQuestion(this.questions[this.questionIndex])
   }

   public activateQuestion(question: Question) {
      this.moderator.displayQuestion(question)

      let answers = 0
      for (const player of this.players) {
         player.promptQuestion(question)

         player.client.once("question:answer", (answer: any) => {
            this.answerQuestion(player, answer)
            answers++

            this.logger.log("answers:", answers, "players:", this.players.length)
            if (answers === this.players.length) {
               this.nextQuestion()
            }
         })
      }
   }

   private answerQuestion(player: Player, answer: any) {
      const question = this.questions[this.questionIndex]
      player.lastQuestionResult = isCorrect(question, answer)
   }

   public getPlayerByToken(token: PlayerToken) {
      return this.players.find(player => player.token === token)
   }

   public getInfo(): RoomInfo {
      return { id: this.id, name: this.name }
   }
}
