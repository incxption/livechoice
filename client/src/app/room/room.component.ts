import { Component, OnInit, ViewChild } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy"
import { RoomService } from "../services/room.service"
import { ONLY_READ_DURATION, Question } from "livechoice-common"
import { LeaderboardData } from "../question/leaderboard/leaderboard.component"
import { QuestionPromptComponent } from "../question/question-prompt/question-prompt.component"

@UntilDestroy()
@Component({
   selector: "app-room",
   templateUrl: "./room.component.html",
   styleUrls: ["./room.component.scss"]
})
export class RoomComponent implements OnInit {
   roomId: string = ""
   roomName: string = ""
   state = "joining"

   @ViewChild(QuestionPromptComponent) questionPrompt!: QuestionPromptComponent

   question: Question | undefined
   questionCorrect: boolean | undefined
   onlyRead: boolean = false
   revealAnswer: boolean = false

   leaderboardData: LeaderboardData = []

   authenticationError: string = ""
   playerName: string = ""

   demo = {
      number: 2,
      name: "Würfel",
      prompt: "Wie viele Seiten hat ein Würfel?",
      type: "input",
      scoreType: "placement",
      maxScore: 50,
      correctAnswers: [6]
   } as any

   constructor(private route: ActivatedRoute, private roomService: RoomService) {}

   ngOnInit() {
      this.route.params.pipe(untilDestroyed(this)).subscribe(params => {
         const id = params["id"]
         this.roomId = id
         this.roomService.joinRoom(id)
      })

      let onlyReadTimeoutId = -1
      this.roomService.registerHandlers(this, on => {
         on.roomNotFound(() => (this.state = "room-not-found"))
         on.roomAuthenticationRequest(() => (this.state = "authentication-request"))
         on.roomAuthenticationError(error => {
            this.state = "authentication-error"
            this.authenticationError = error
         })

         on.roomJoined(({ name }) => {
            this.state = "joined"
            this.roomName = name
         })

         on.roomModerating(({ name }) => {
            this.state = "moderating"
            this.roomName = name
         })

         on.playerProperties(properties => (this.playerName = properties.name))

         on.questionPrompt(question => {
            this.question = question
            this.questionPrompt?.resetAnswered()
            this.onlyRead = true
            this.questionCorrect = undefined
            this.state = "question-prompt"

            clearTimeout(onlyReadTimeoutId)
            onlyReadTimeoutId = setTimeout(() => {
               this.onlyRead = false
               this.questionPrompt?.focusInput()
            }, ONLY_READ_DURATION)
         })

         on.questionDisplay(question => {
            this.question = question
            this.revealAnswer = false
            this.state = "question-display"
         })

         on.questionRevealAnswer(() => {
            this.revealAnswer = true
         })

         on.questionResult(correct => {
            this.questionCorrect = correct
         })

         on.showLeaderboard(data => {
            this.leaderboardData = data
            this.state = "leaderboard"
         })
      })
   }

   authenticate(key: string) {
      this.roomService.authenticate(key)
   }
}
