import { KeyMap } from '../keymap';
import { UIConfig } from '../config';
import { GameConfig } from '../config';
import { GlobalVars } from '../global';

let screenHeight : number;
let screenWidth : number;

export class Rocket extends Phaser.GameObjects.Sprite {
    private fired : boolean;
    private moveSpeed : number;
    private sfxShot : Phaser.Sound.BaseSound;
    public hasHit : boolean;

    constructor(scene : Phaser.Scene, x : number, y : number, texture : string, frame : number | null = 0) {
        super(scene, x, y, texture, frame);
  
        scene.add.existing(this);  // add to existing, displayList, updateList
        this.fired     = false;     // track rocket's firing status
        this.moveSpeed = 2;        // rocket speed in pixels/frame

        this.sfxShot = scene.sound.add('sfx-shot');
        screenHeight = parseInt(GameConfig.scale.height as string);
        screenWidth  = parseInt(GameConfig.scale.width  as string);
        this.hasHit = true;
    }

    update(time : number, delta : number) {
        // left/right movement
        let moveDir : number = 0;
        let moveDampener : number = 1;

        // if we are moving, dampen the amount the player can move.
        if (this.fired) {
            moveDampener = GlobalVars.strafe;
        }

        if (KeyMap.keyLEFT.isDown && this.x >= UIConfig.borderUISize + this.width) {
            moveDir = -this.moveSpeed;
        } else if (KeyMap.keyRIGHT.isDown && this.x <= screenWidth - UIConfig.borderUISize - this.width) {
            moveDir =  this.moveSpeed;
        }

        this.x += moveDir * moveDampener;

        // fire button
        if(Phaser.Input.Keyboard.JustDown(KeyMap.keyFIRE) && !this.fired) {
            this.fired  = true;
            this.hasHit = false;
            this.sfxShot.play();
        }

        // if fired, move up
        if(this.fired && this.y >= UIConfig.borderUISize * 3 + UIConfig.borderPadding) {
            this.y -= this.moveSpeed;
        }

        // reset on miss
        if(this.y <= UIConfig.borderUISize * 3 + UIConfig.borderPadding) {
            this.reset();
        }
    }

    // reset rocket to "ground"
    reset() {
        this.fired = false;
        this.y = screenHeight - UIConfig.borderUISize - UIConfig.borderPadding;
    }

    isFiring() : boolean {
        return this.fired;
    }
}
