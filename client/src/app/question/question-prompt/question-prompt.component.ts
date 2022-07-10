import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core"
import { ONLY_READ_DURATION, Question } from "livechoice-common"
import { RoomService } from "../../services/room.service"

@Component({
   selector: "app-question-prompt",
   templateUrl: "./question-prompt.component.html",
   styleUrls: ["./question-prompt.component.scss"]
})
export class QuestionPromptComponent {
   @Input() question!: Question
   @Input() onlyRead!: boolean
   @Input() correct: boolean | undefined

   isAnswered: boolean = false
   @ViewChild("inputElement") inputElement!: ElementRef<HTMLInputElement>

   readonly onlyReadDuration = ONLY_READ_DURATION / 1000

   constructor(private roomService: RoomService) {}

   resetAnswered() {
      this.isAnswered = false
   }

   focusInput() {
      setTimeout(() => this.inputElement?.nativeElement?.focus(), 50)
   }

   sendMultipleChoiceAnswer(index: number) {
      this.roomService.sendAnswer(index)
      this.isAnswered = true
   }

   sendInputAnswer() {
      const value = this.inputElement.nativeElement.value
      this.roomService.sendAnswer(value)
      this.isAnswered = true
   }

   filterInput(event: KeyboardEvent) {
      const code = event.code
      if (["ArrowRight", "ArrowLeft", "Backspace", "Delete"].includes(code)) {
         return
      }
      const last = parseInt(code[code.length - 1])
      if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(last)) {
         return
      }

      event.preventDefault()
   }

   get backgroundColor(): string | undefined {
      if (this.correct === true) {
         return "#20bf6b"
      } else if (this.correct === false) {
         return "#eb3b5a"
      } else {
         return undefined
      }
   }

   get isEffectivelyAnswered() {
      return this.isAnswered || this.correct != undefined
   }
}
