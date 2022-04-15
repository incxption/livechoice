import { Injectable } from "@angular/core"

@Injectable({
   providedIn: "root"
})
export class FileHelperService {
   constructor() {}

   readTextFromFile(): Promise<string> {
      return new Promise<string>(resolve => {
         const input = document.createElement("input")
         input.type = "file"
         input.onchange = () => {
            const file = input.files![0]
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.readAsText(file)
         }
         input.click()
      })
   }
}
