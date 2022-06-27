import { Component, Input } from "@angular/core"
import { Question } from "@livechoice/common"

export const ONLY_READ_DURATION = 5_000

@Component({
   selector: "app-question-prompt",
   templateUrl: "./question-prompt.component.html",
   styleUrls: ["./question-prompt.component.scss"]
})
export class QuestionPromptComponent {
   @Input() question!: Question
   @Input() onlyRead!: boolean

   readonly onlyReadDuration = ONLY_READ_DURATION / 1000
}
