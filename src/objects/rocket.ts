import { KeyMap } from '../keymap';
import { UIConfig } from '../config';
import { GameConfig } from '../config';

let screenHeight : number;
let screenWidth : number;

export class Rocket extends Phaser.GameObjects.Sprite {
    private isFiring : boolean;
    private moveSpeed : number;
    private sfxShot : Phaser.Sound.BaseSound;

    constructor(scene : Phaser.Scene, x : number, y : number, texture : string, frame : number | null = 0) {
        super(scene, x, y, texture, frame)
  
        scene.add.existing(this);  // add to existing, displayList, updateList
        this.isFiring = false;     // track rocket's firing status
        this.moveSpeed = 2;        // rocket speed in pixels/frame

        this.sfxShot = scene.sound.add('sfx-shot');
        screenHeight = parseInt(GameConfig.scale.height as string);
        screenWidth  = parseInt(GameConfig.scale.width  as string);
    }

    update() {
        // left/right movement
        if(!this.isFiring) {
            if(KeyMap.keyLEFT.isDown && this.x >= UIConfig.borderUISize + this.width) {
                this.x -= this.moveSpeed
            } else if(KeyMap.keyRIGHT.isDown && this.x <= screenWidth - UIConfig.borderUISize - this.width) {
                this.x += this.moveSpeed
            }
        }
        // fire button
        if(Phaser.Input.Keyboard.JustDown(KeyMap.keyFIRE) && !this.isFiring) {
            this.isFiring = true
            this.sfxShot.play()
        }
        // if fired, move up
        if(this.isFiring && this.y >= UIConfig.borderUISize * 3 + UIConfig.borderPadding) {
            this.y -= this.moveSpeed
        }
        // reset on miss
        if(this.y <= UIConfig.borderUISize * 3 + UIConfig.borderPadding) {
            this.isFiring = false
            this.y = screenHeight - UIConfig.borderUISize - UIConfig.borderPadding
        }
    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false
        this.y = screenHeight - UIConfig.borderUISize - UIConfig.borderPadding
    }
}
