import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import {
   NbThemeModule,
   NbLayoutModule,
   NbListModule,
   NbCardModule,
   NbButtonModule,
   NbInputModule
} from "@nebular/theme"
import { NbEvaIconsModule } from "@nebular/eva-icons"
import { TodoComponent } from "./todo/todo.component"
import { FormsModule } from "@angular/forms"
import { RoomComponent } from "./room/room.component"
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io"
import { RoomService } from "./services/room.service";
import { CreateComponent } from './create/create.component'

const socketConfig: SocketIoConfig = {
   url: "http://localhost:2020"
}

@NgModule({
   declarations: [AppComponent, TodoComponent, RoomComponent, CreateComponent],
   imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      SocketIoModule.forRoot(socketConfig),
      NbThemeModule.forRoot({ name: "default" }),
      NbLayoutModule,
      NbEvaIconsModule,
      NbListModule,
      NbCardModule,
      NbButtonModule,
      NbInputModule,
      FormsModule
   ],
   providers: [RoomService],
   bootstrap: [AppComponent]
})
export class AppModule {}
