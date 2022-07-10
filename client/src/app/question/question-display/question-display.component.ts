import { Component, Input, OnInit } from "@angular/core"
import { Question } from "livechoice-common"

@Component({
   selector: "app-question-display",
   templateUrl: "./question-display.component.html",
   styleUrls: ["./question-display.component.scss"]
})
export class QuestionDisplayComponent {
   @Input() question!: Question
}
