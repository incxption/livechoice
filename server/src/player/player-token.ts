import { PlayerProperties } from "./player"

export class PlayerToken {
   public used: boolean = false

   constructor(public key: string, public properties: PlayerProperties) {}
}
