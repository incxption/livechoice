import { Socket } from "socket.io"
import { UnknownPlayer } from "../player/unknown-player"
import {
   evaluateScore,
   isCorrect,
   ONLY_READ_DURATION,
   PlayerToken,
   Question,
   RoomInfo,
   Serializer
} from "livechoice-common"
import { Player } from "../player/player"
import { Moderator } from "../player/moderator"
import { Logger } from "@nestjs/common"

export class Room {
   playerTokens: PlayerToken[] = []

   questions: Question[] = []
   questionIndex: number = 0

   timeoutId: NodeJS.Timeout
   receivedAnswers: number = 0
   questionPromptTime: number = -1

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
      clearTimeout(this.timeoutId)
      this.logger.log("Moving on to next question...")

      // send results to all players
      for (const player of this.players) {
         player.sendAnswerResult()
      }
      this.moderator.showAnswer()
      this.logger.log("showing answer")

      setTimeout(() => {
         // display leaderboard before next question
         this.showLeaderboard()

         this.questionIndex++
         if (this.questionIndex >= this.questions.length) {
            // TODO: show game ended?
            return
         }

         setTimeout(() => this.activateQuestion(this.questions[this.questionIndex]), 6_000)
      }, 5_000)
   }

   public activateQuestion(question: Question) {
      this.moderator.displayQuestion(question)
      this.receivedAnswers = 0
      this.questionPromptTime = Date.now()

      for (const player of this.players) {
         player.client.removeAllListeners("question:answer")
         player.promptQuestion(question)

         player.client.once("question:answer", (answer: any) => {
            this.answerQuestion(player, answer)
            this.receivedAnswers++

            if (this.receivedAnswers === this.players.length) {
               this.nextQuestion()
            }
         })
      }

      clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => {
         this.questionTimedOut()
         this.nextQuestion()
      }, question.timeout * 1000 + ONLY_READ_DURATION)
   }

   private showLeaderboard() {
      const data = this.players
         .map(player => ({
            name: player.token.properties.name,
            score: player.totalScore
         }))
         .sort((a, b) => b.score - a.score)

      for (const player of this.players) {
         player.client.emit("leaderboard", data)
      }
   }

   private questionTimedOut() {
      for (const player of this.players) {
         player.client.removeAllListeners("question:answer")
         if (player.individualScores.length <= this.questionIndex) {
            // player has not answered the question
            player.lastQuestionResult = false
            player.individualScores.push(0)
         }
      }
   }

   private answerQuestion(player: Player, answer: any) {
      const question = this.questions[this.questionIndex]
      player.lastQuestionResult = isCorrect(question, answer)

      if (player.lastQuestionResult) {
         const score = evaluateScore(question, this.receivedAnswers, this.questionPromptTime)
         player.individualScores.push(score)
      } else {
         player.individualScores.push(0)
      }
   }

   public getPlayerByToken(token: PlayerToken) {
      return this.players.find(player => player.token === token)
   }

   public getInfo(): RoomInfo {
      return { id: this.id, name: this.name }
   }
}
