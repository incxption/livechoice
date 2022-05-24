import { Component, Input, OnInit } from "@angular/core"

@Component({
   selector: "app-room-waiting",
   templateUrl: "./room-waiting.component.html",
   styleUrls: ["./room-waiting.component.scss"]
})
export class RoomWaitingComponent {
   @Input() roomName!: string
   @Input() playerName!: string
}
