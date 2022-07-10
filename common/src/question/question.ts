export class Question {
   // general properties
   public number: number
   public name: string
   public prompt: string
   public type: "multiple-choice" | "input"

   // multiple choice properties
   public answers: Choice[]

   // input properties
   public correctAnswers: number[]
}

export interface Choice {
   text: string
   correct: boolean
}

export function isCorrect(question: Question, answer: any) {
   if (question.type === "multiple-choice") {
      return question.answers[answer].correct
   } else if (question.type === "input") {
      return question.correctAnswers.includes(answer)
   }
}
