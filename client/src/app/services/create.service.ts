import { Injectable } from "@angular/core"
import { Socket } from "ngx-socket-io"
import { Router } from "@angular/router"
import { untilDestroyed } from "@ngneat/until-destroy"

@Injectable({
   providedIn: "root"
})
export class CreateService {
   constructor(private socket: Socket, private router: Router) {}

   public createRoom() {
      this.socket.emit("room:create")
   }

   public handleRoomCreated(instance: any) {
      this.socket
         .fromEvent<any>("room:created")
         .pipe(untilDestroyed(instance))
         .subscribe(info => {
            const { id } = info
            return this.router.navigate(["room", id])
         })
   }
}
