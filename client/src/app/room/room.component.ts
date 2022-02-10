import { Component, OnDestroy, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { firstValueFrom, Subscription } from "rxjs"
import { ChatService } from "../services/chat.service"

@Component({
   selector: "app-room",
   templateUrl: "./room.component.html",
   styleUrls: ["./room.component.scss"]
})
export class RoomComponent implements OnInit, OnDestroy {
   roomId: string = ""

   $chatSubscription?: Subscription
   $userSubscription?: Subscription

   users: number = 0
   message: string = ""
   messages: string[] = []

   constructor(private route: ActivatedRoute, private chatService: ChatService) {}

   async ngOnInit() {
      const params = await firstValueFrom(this.route.params)
      this.roomId = params["id"]

      this.$chatSubscription = this.chatService.getChat().subscribe(message => {
         this.messages.push(message)
      })

      this.$userSubscription = this.chatService.getUsers().subscribe(users => {
         this.users = users
      })
   }

   ngOnDestroy(): void {
      this.$chatSubscription?.unsubscribe()
      this.$userSubscription?.unsubscribe()
   }

   sendChat() {
      this.messages.push(this.message)
      this.chatService.sendChat(this.message)
      this.message = ""
   }
}
