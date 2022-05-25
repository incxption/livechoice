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
