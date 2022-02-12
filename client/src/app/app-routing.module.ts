import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { TodoComponent } from "./todo/todo.component"
import { RoomComponent } from "./room/room.component"
import { CreateComponent } from "./create/create.component"

const routes: Routes = [
   { path: "todo", component: TodoComponent },
   { path: "room/:id", component: RoomComponent },
   { path: "create", component: CreateComponent }
]

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule {}
