import { Injectable } from "@nestjs/common"
import { Room } from "./room"
import { Socket } from "socket.io"

@Injectable()
export class RoomService {
   private rooms: Room[] = [new Room("test")]

   public joinRoom(client: Socket, roomId: string) {
      const room = this.findRoomById(roomId)

      if (!room) {
         client.emit("room:not-found")
         return
      }

      room.join(client)
   }

   public findRoomById(id: string): Room | undefined {
      return this.rooms.find(room => room.id === id)
   }
}
