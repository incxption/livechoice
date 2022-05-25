import { Component, Input, OnInit } from "@angular/core"
import { Question } from "@livechoice/common"

@Component({
   selector: "app-question-prompt",
   templateUrl: "./question-prompt.component.html",
   styleUrls: ["./question-prompt.component.scss"]
})
export class QuestionPromptComponent {
   @Input() question!: Question
}
