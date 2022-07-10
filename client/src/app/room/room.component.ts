import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy"
import { RoomService } from "../services/room.service"
import { ONLY_READ_DURATION, Question } from "livechoice-common"

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

   question: Question | undefined
   questionCorrect: boolean | undefined
   onlyRead: boolean = false

   authenticationError: string = ""
   playerName: string = ""

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
            this.onlyRead = true
            this.questionCorrect = undefined
            this.state = "question-prompt"

            clearTimeout(onlyReadTimeoutId)
            onlyReadTimeoutId = setTimeout(() => {
               this.onlyRead = false
            }, ONLY_READ_DURATION)
         })

         on.questionDisplay(question => {
            this.question = question
            this.state = "question-display"
         })

         on.questionResult(correct => {
            this.questionCorrect = correct
         })
      })
   }

   authenticate(key: string) {
      this.roomService.authenticate(key)
   }
}
