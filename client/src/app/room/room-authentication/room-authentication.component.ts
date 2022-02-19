import { Component, EventEmitter, Output } from "@angular/core"

@Component({
   selector: "app-room-authentication",
   templateUrl: "./room-authentication.component.html",
   styleUrls: ["./room-authentication.component.scss"]
})
export class RoomAuthenticationComponent {
   @Output()
   submitAuthentication = new EventEmitter<string>()

   input: string = ""

   constructor() {}

   submit() {
      this.submitAuthentication.emit(this.input)
   }
}
