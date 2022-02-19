import { Injectable } from "@nestjs/common"
import { Room } from "./room"
import { Socket } from "socket.io"

@Injectable()
export class RoomService {
   private rooms: Room[] = []

   public joinRoom(client: Socket, roomId: string) {
      const room = this.findRoomById(roomId)

      if (!room) {
         client.emit("room:not-found")
         return
      }

      room.join(client)
   }

   public createRoom(client: Socket, roomName: string) {
      const room = new Room(RoomService.generateRoomId(), roomName)
      this.rooms.push(room)

      room.initModerator(client)
   }

   public findRoomById(id: string): Room | undefined {
      return this.rooms.find(room => room.id === id)
   }

   private static generateRoomId() {
      return (Math.random() * 647231).toString(14).replace(".", "").substring(1, 6)
   }
}
