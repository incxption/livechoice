import { Component, Input, OnInit } from "@angular/core"
import { Question } from "livechoice-common"

@Component({
   selector: "app-question-display",
   templateUrl: "./question-display.component.html",
   styleUrls: ["./question-display.component.scss"]
})
export class QuestionDisplayComponent {
   @Input() question!: Question
   @Input() reveal!: boolean

   get correctAnswer(): string {
      if (this.question.type === "input") {
         return this.question.correctAnswers.join(" oder ")
      } else {
         return this.question.answers
            .filter(c => c.correct)
            .map(c => c.text)
            .join(" oder ")
      }
   }
}
