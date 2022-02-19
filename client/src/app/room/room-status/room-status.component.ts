import { Component, Input } from "@angular/core"
import { Router } from "@angular/router"

@Component({
   selector: "app-room-status",
   templateUrl: "./room-status.component.html",
   styleUrls: ["./room-status.component.scss"]
})
export class RoomStatusComponent {
   @Input() status!: "loading" | "error"
   @Input() title!: string
   @Input() message!: string

   constructor(private router: Router) {}

   navigateToHome() {
      return this.router.navigate(["/"])
   }

   reload() {
      window.location.reload()
   }

   get isLoading() {
      return this.status === "loading"
   }

   get isError() {
      return this.status === "error"
   }
}
