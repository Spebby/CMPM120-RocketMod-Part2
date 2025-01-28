import { GameConfig } from '../config';
import { GlobalVars } from "../global";
import { SoundLib } from "../soundlib";

let screenWidth  : number;
let screenHeight : number;

// Spaceship prefab
export class Spaceship extends Phaser.GameObjects.Sprite {
    private points    : number;
    private moveSpeed : number;
    private startPos  : number;
    private endPos    : number;
    private sceneRef  : Phaser.Scene;

    constructor(scene : Phaser.Scene, x : number, y : number, texture : string, frame : number, pointValue : number) {
        screenWidth  = parseInt(GameConfig.scale.width as string);
        screenHeight = parseInt(GameConfig.scale.height as string);
        
        let swap = Math.random() > 0.5;
        x = swap ? -x : x;

        super(scene, x, y, texture, frame);
        this.sceneRef = scene;
        this.sceneRef.add.existing(this);          // add to existing scene

        this.points    = pointValue;               // store pointValue
        this.moveSpeed = GlobalVars.shipSpeed;     // spaceship speed in pixels/frame


        this.startPos = screenWidth;
        this.endPos   = 0;

        // pick random dir
        this.shuffleDirection(swap);
        console.log(`Spaceship created at : (${Math.round(x)}, ${Math.round(y)}) with speed ${this.moveSpeed}!`);
    }

    update(time : number, delta : number) : void {
        // move spaceship left
        this.x -= this.moveSpeed;

        // wrap from end to start post
        if (this.outOfBounds()) {
            this.reset();
        }
    }

    outOfBounds() : boolean {
        if (this.endPos > 0) {
            return this.x > this.endPos;            
        }

        return this.x < this.endPos;
    }

    // reset position
    reset() : void {
        this.x = this.startPos;
    }

    getPoints() : number {
        return this.points;
    }

    setSpeedMultiplier(multiplier : number) : void {
        this.moveSpeed *= multiplier;
    }

    resetSpeed() : void {
        let side = this.flipX ? -1 : 1;
        this.moveSpeed = GlobalVars.shipSpeed * side;
    }

    shuffleDirection(swap? : boolean) : void {
        if (swap ?? Math.random() > 0.5) {
            this.setSpeedMultiplier(-1);
            [this.endPos, this.startPos] = [this.startPos, this.endPos];
            this.flipX = !this.flipX;
        }
    }

    onDeath() : void {
        this.alpha = 0;
        this.shuffleDirection();

        let boom = this.sceneRef.add.sprite(this.x, this.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {   // callback after anim completes
          this.reset();                        // reset ship position
          this.alpha = 1;                      // make ship visible again
          boom.destroy();                      // remove explosion sprite
        });
        this.sceneRef.sound.play(SoundLib.randSoundUnweight('explosion'));

        this.scene.events.emit('shipDied', this.points);
    }
}
