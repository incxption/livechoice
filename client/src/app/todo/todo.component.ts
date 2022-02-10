import { Component } from "@angular/core"

@Component({
   selector: "app-todo",
   templateUrl: "./todo.component.html",
   styleUrls: ["./todo.component.scss"]
})
export class TodoComponent {
   todos: string[] = ["Erstelle eine Angular App", "Teste die App", "Lade die App in einem Browser"]
   newTodo: string = ""

   addTodo() {
      if (this.newTodo.length <= 0) return

      this.todos.push(this.newTodo)
      this.newTodo = ""
   }

   removeTodo(todo: string) {
      this.todos = this.todos.filter(t => t !== todo)
   }

   clearTodos() {
      this.todos = []
   }

   get amountOfTodos() {
      return this.todos.length
   }
}
