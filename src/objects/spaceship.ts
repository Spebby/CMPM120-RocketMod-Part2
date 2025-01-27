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
        super(scene, x, y, texture, frame);
        this.sceneRef = scene;
        this.sceneRef.add.existing(this);          // add to existing scene

        this.points    = pointValue;               // store pointValue
        this.moveSpeed = GlobalVars.shipSpeed;     // spaceship speed in pixels/frame
        screenWidth  = parseInt(GameConfig.scale.width as string);
        screenHeight = parseInt(GameConfig.scale.height as string);

        this.startPos = screenWidth;
        this.endPos   = 0;

        // left to right instead.
        if (Math.random() > 0.5) {
            this.moveSpeed  = -this.moveSpeed;
            this.endPos     = this.startPos;
            this.startPos   = 0;
            this.flipX = true;
        }
    }

    update(time : number, delta : number) : void {
        // move spaceship left
        this.x -= this.moveSpeed;

        // wrap from end to start post
        if (this.x < Math.min(this.startPos, this.endPos) || this.x > Math.max(this.startPos, this.endPos)) {
            this.reset();
        }
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
        this.moveSpeed = GlobalVars.shipSpeed;
    }

    shuffleDirection() : void {
        if (Math.random() > 0.5) {
            this.moveSpeed  = -this.moveSpeed;
            var t           = this.endPos;
            this.endPos     = this.startPos;
            this.startPos   = t;
            this.flipX      = !this.flipX;
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
