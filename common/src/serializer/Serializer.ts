import { plainToInstance } from "class-transformer"
import { Question } from "../question/question"

export class Serializer {
   public static deserializeQuestions(input: string) {
      const array: any[] = JSON.parse(input)
      return array.map(obj => plainToInstance(Question, obj))
   }
}
