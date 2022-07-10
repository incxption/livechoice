export const ONLY_READ_DURATION = 5
// TODO: change this back to 5_000

export class Question {
   // general properties
   public number: number
   public name: string
   public prompt: string
   public type: "multiple-choice" | "input"

   // scoring properties
   public scoreType: "placement" | "time"
   public maxScore: number

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

const multipliers: { [place: number]: number } = { 0: 1, 1: 0.85, 2: 0.7, 3: 0.6, 4: 0.5 }

export function evaluateScore(
   question: Question,
   previousAnswers: number,
   questionPromptTime: number
) {
   if (question.scoreType === "placement") {
      const multiplier = multipliers[previousAnswers]
      return multiplier ? Math.round(multiplier * question.maxScore) : 0
   } else {
      const timeNeeded = Date.now() - questionPromptTime - ONLY_READ_DURATION
      const secondsNeeded = Math.floor(timeNeeded / 1000)
      const lostPoints = Math.floor(secondsNeeded / 5) * 5

      return question.maxScore - lostPoints
   }
}
