import { Injectable } from "@angular/core"
import { Socket } from "ngx-socket-io"
import { untilDestroyed } from "@ngneat/until-destroy"

type HandlerBlock = {
   roomNotFound: HandlerFunction<void>
   roomAuthenticationRequest: HandlerFunction<void>
   roomAuthenticationError: HandlerFunction<string>
   roomJoined: HandlerFunction<string>
   playerProperties: HandlerFunction<any>
}

type HandlerFunction<T> = (callback: (data: T) => void) => void

@Injectable({
   providedIn: "root"
})
export class RoomService {
   constructor(private socket: Socket) {}

   public joinRoom(roomId: string) {
      this.socket.emit("room:join", roomId)
   }

   public authenticate(key: string) {
      this.socket.emit("room:authentication:response", key)
   }

   public registerHandlers(instance: any, block: (on: HandlerBlock) => void) {
      const socket = this.socket

      function createHandlerFunction<T>(event: string): HandlerFunction<T> {
         return (callback: (data: T) => void) => {
            socket.fromEvent<T>(event).pipe(untilDestroyed(instance)).subscribe(callback)
         }
      }

      block({
         roomNotFound: createHandlerFunction<void>("room:not-found"),
         roomAuthenticationRequest: createHandlerFunction<void>("room:authentication:request"),
         roomAuthenticationError: createHandlerFunction<string>("room:authentication:error"),
         roomJoined: createHandlerFunction<string>("room:joined"),
         playerProperties: createHandlerFunction<any>("player:properties")
      })
   }
}
