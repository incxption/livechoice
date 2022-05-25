import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy"
import { RoomService } from "../services/room.service"
import { Question } from "@livechoice/common"

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

   authenticationError: string = ""
   playerName: string = ""

   constructor(private route: ActivatedRoute, private roomService: RoomService) {}

   ngOnInit() {
      this.route.params.pipe(untilDestroyed(this)).subscribe(params => {
         const id = params["id"]
         this.roomId = id
         this.roomService.joinRoom(id)
      })

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
            this.state = "question-prompt"
         })

         on.questionDisplay(question => {
            this.question = question
            this.state = "question-display"
         })
      })
   }

   authenticate(key: string) {
      this.roomService.authenticate(key)
   }
}
