import { PlayerProperties } from "./player-properties"

export class PlayerToken {
   public used: boolean = false

   constructor(public key: string, public properties: PlayerProperties) {}
}
