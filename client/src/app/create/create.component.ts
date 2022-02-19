import { Component, OnInit } from "@angular/core"
import { CreateService } from "../services/create.service"
import { UntilDestroy } from "@ngneat/until-destroy"

@UntilDestroy()
@Component({
   selector: "app-create",
   templateUrl: "./create.component.html",
   styleUrls: ["./create.component.scss"]
})
export class CreateComponent implements OnInit {
   roomName: string = ""

   constructor(private createService: CreateService) {}

   ngOnInit(): void {
      this.createService.handleRoomCreated(this)
   }

   createRoom() {
      if (this.roomName === "") return

      this.createService.createRoom(this.roomName)
      this.roomName = ""
   }
}
