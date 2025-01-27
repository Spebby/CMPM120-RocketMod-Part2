import { GameConfig } from "../config";
import { UIConfig } from "../config";
import { KeyMap } from "../keymap";
import { GlobalVars } from "../global";

const assetPath = process.env.NODE_ENV === 'production' ? './assets' : '../assets';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() : void {
        this.load.image('rocket', `${assetPath}/rocket.png`);
        this.load.image('spaceship', `${assetPath}/spaceship.png`);
        this.load.image('starfield', `${assetPath}/starfield.png`);
        
        // load spritesheet
        this.load.spritesheet('explosion', `${assetPath}/explosion.png`, {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        });

        // audio
        this.load.audio('sfx-select', `${assetPath}/sfx-select.wav`);
        this.load.audio('sfx-explosion', `${assetPath}/sfx-explosion.wav`);
        this.load.audio('sfx-shot', `${assetPath}/sfx-shot.wav`);
    }

    create() : void {
        KeyMap.initialize(this);
        // animation configuration
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 9,
                first: 0
            }),
            frameRate: 30
        });

        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        };

        let hHeight = parseInt(GameConfig.scale.height as string) / 2;
        let hWidth  = parseInt(GameConfig.scale.width  as string) / 2; 

        // display menu text
        this.add.text(hWidth, hHeight - UIConfig.borderUISize - UIConfig.borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.add.text(hWidth, hHeight, 'Use ←→ arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(hWidth, hHeight + UIConfig.borderUISize + UIConfig.borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);
    }

    update() : void {
        if (Phaser.Input.Keyboard.JustDown(KeyMap.keyLEFT)) {
            // easy mode
            GlobalVars.shipSpeed = 3,
            GlobalVars.gameTimer = 60000;

            this.sound.play('sfx-select');
            this.scene.start('PlayScene');
        };
        if (Phaser.Input.Keyboard.JustDown(KeyMap.keyRIGHT)) {
            // hard mode
            GlobalVars.shipSpeed = 4;
            GlobalVars.gameTimer = 45000;

            this.sound.play('sfx-select');
            this.scene.start('PlayScene');
        }
    }
}
