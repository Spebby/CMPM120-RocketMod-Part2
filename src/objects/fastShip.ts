import { GlobalVars } from "../global";
import { Spaceship } from './spaceship';

// Spaceship prefab
export class FastShip extends Spaceship {
    constructor(scene : Phaser.Scene, x : number, y : number, texture : string, frame : number, pointValue : number) {
        super(scene, x, y, texture, frame, pointValue);
        this.moveSpeed *= 1.25;

        this.scale *= 0.75;
    }

    resetSpeed() : void {
        let side = this.flipX ? -1 : 1;
        this.moveSpeed = GlobalVars.shipSpeed * side * 1.25;
    }
}