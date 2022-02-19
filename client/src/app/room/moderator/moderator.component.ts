import { Component, ElementRef, OnInit, ViewChild } from "@angular/core"
import { RoomService } from "../../services/room.service"
import { PlayerToken } from "@livechoice/common"
import { UntilDestroy } from "@ngneat/until-destroy"

@UntilDestroy()
@Component({
   selector: "app-room-moderator",
   templateUrl: "./moderator.component.html",
   styleUrls: ["./moderator.component.scss"]
})
export class ModeratorComponent implements OnInit {
   tokens: PlayerToken[] = []

   @ViewChild("key") keyInput!: ElementRef<HTMLInputElement>
   @ViewChild("name") nameInput!: ElementRef<HTMLInputElement>

   constructor(private roomService: RoomService) {}

   ngOnInit(): void {
      this.roomService.registerHandlers(this, on => {
         on.roomTokens(tokens => {
            this.tokens = tokens
         })
      })
   }

   createToken(name: string, key: string) {
      if (name === "" || key === "") return

      this.keyInput.nativeElement.value = ""
      this.nameInput.nativeElement.value = ""

      this.roomService.createToken(name, key)
   }
}
