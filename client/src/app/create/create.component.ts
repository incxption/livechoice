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
   constructor(private createService: CreateService) {}

   ngOnInit(): void {
      this.createService.handleRoomCreated(this)
   }

   createRoom() {
      this.createService.createRoom()
   }
}
