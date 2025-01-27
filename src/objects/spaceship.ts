import { GameConfig } from '../config';
import { GlobalVars } from "../global";

let screenWidth  : number;
let screenHeight : number;

// Spaceship prefab
export class Spaceship extends Phaser.GameObjects.Sprite {
    private points : number;
    private moveSpeed : number;

    constructor(scene : Phaser.Scene, x : number, y : number, texture : string, frame : number, pointValue : number) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);                        // add to existing scene
        this.points = pointValue;                        // store pointValue
        this.moveSpeed = GlobalVars.shipSpeed;   // spaceship speed in pixels/frame
        screenWidth  = parseInt(GameConfig.scale.width as string);
        screenHeight = parseInt(GameConfig.scale.height as string);
    }

    update() : void {
        // move spaceship left
        this.x -= this.moveSpeed;

        // wrap from left to right edge
        if(this.x <= 0 - this.width) {
            this.x = screenWidth;
        }
    }

    // reset position
    reset() : void {
        this.x = screenWidth;
    }

    getPoints() : number {
        return this.points;
    }
}
