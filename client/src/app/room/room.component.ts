import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { ChatService } from "../services/chat.service"
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy"

@UntilDestroy()
@Component({
   selector: "app-room",
   templateUrl: "./room.component.html",
   styleUrls: ["./room.component.scss"]
})
export class RoomComponent implements OnInit {
   roomId: string = ""

   users: number = 0
   message: string = ""
   messages: string[] = []

   constructor(private route: ActivatedRoute, private chatService: ChatService) {}

   async ngOnInit() {
      this.route.queryParams
         .pipe(untilDestroyed(this))
         .subscribe(params => (this.roomId = params["id"]))

      this.chatService
         .getChat()
         .pipe(untilDestroyed(this))
         .subscribe(message => this.messages.push(message))

      this.chatService
         .getUsers()
         .pipe(untilDestroyed(this))
         .subscribe(users => (this.users = users))
   }

   sendChat() {
      this.messages.push(this.message)
      this.chatService.sendChat(this.message)
      this.message = ""
   }
}
