import { Injectable } from "@nestjs/common"
import { Room } from "./room"
import { Socket } from "socket.io"
import { PlayerToken } from "@livechoice/common"

@Injectable()
export class RoomService {
   private rooms: Room[] = [new Room("debug", "Debug Room")]

   public joinRoom(client: Socket, roomId: string) {
      const room = this.findRoomById(roomId)

      if (!room) {
         client.emit("room:not-found")
         return
      }

      room.join(client)
   }

   public createRoom(client: Socket, roomName: string) {
      if (roomName === "debug") {
         const room = this.rooms[0]
         room.initModerator(client)

         setTimeout(() => {
            room.playerTokens = []
            room.addToken(new PlayerToken("one", { name: "Test 1" }))
            room.addToken(new PlayerToken("two", { name: "Test 2" }))
         }, 300)
         return
      }

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
