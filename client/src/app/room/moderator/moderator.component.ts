import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core"
import { RoomService } from "../../services/room.service"
import { PlayerToken, Question, Serializer } from "@livechoice/common"
import { UntilDestroy } from "@ngneat/until-destroy"
import { FileHelperService } from "../../services/file-helper.service"

@UntilDestroy()
@Component({
   selector: "app-room-moderator",
   templateUrl: "./moderator.component.html",
   styleUrls: ["./moderator.component.scss"]
})
export class ModeratorComponent implements OnInit {
   tokens: PlayerToken[] = []
   questions: Question[] = []

   @Input() roomName!: string

   @ViewChild("key") keyInput!: ElementRef<HTMLInputElement>
   @ViewChild("name") nameInput!: ElementRef<HTMLInputElement>

   constructor(private roomService: RoomService, private fileHelper: FileHelperService) {}

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

   async importQuestions() {
      const input = await this.fileHelper.readTextFromFile()

      this.questions = Serializer.deserializeQuestions(input)
      this.roomService.loadQuestions(input)
   }
}
