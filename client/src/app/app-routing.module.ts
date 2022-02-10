import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { TodoComponent } from "./todo/todo.component"
import { RoomComponent } from "./room/room.component"

const routes: Routes = [
   { path: "todo", component: TodoComponent },
   { path: "room/:id", component: RoomComponent }
]

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule {}
