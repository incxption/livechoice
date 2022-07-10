import { Component, Input } from "@angular/core"
import { ONLY_READ_DURATION, Question } from "@livechoice/common"
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

   readonly onlyReadDuration = ONLY_READ_DURATION / 1000

   constructor(private roomService: RoomService) {}

   sendMultipleChoiceAnswer(index: number) {
      this.roomService.sendMultipleChoiceAnswer(index)
      this.isAnswered = true
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
}
