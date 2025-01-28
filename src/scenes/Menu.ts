interface SoundEffect {
    name: string;
    path: string;
}

import { GameConfig } from "../config";
import { UIConfig } from "../config";
import { KeyMap } from "../keymap";
import { GlobalVars } from "../global";
import { SoundLib } from "../soundlib";
import { Sound } from "../soundlib";

const assetPath = process.env.NODE_ENV === 'production' ? './assets' : '../assets';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() : void {
        this.load.image('rocket', `${assetPath}/rocket.png`);
        this.load.image('spaceship', `${assetPath}/spaceship.png`);
        this.load.image('spaceship', `${assetPath}/fastShip.png`);
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
        SoundLib.addSound('select', new Sound('sfx-select'))        
        this.load.audio('sfx-shot', `${assetPath}/sfx-shot.wav`);
        SoundLib.addSound('shot', new Sound('sfx-shot'))

        this.load.json('soundData', `${assetPath}/soundData.json`);

        // Wait until the JSON file is loaded to continue loading the sounds
        this.load.once('complete', () => {
            // Retrieve the sound data from the loaded JSON
            var data = this.cache.json.get('soundData');
            console.log(data);
            for (const key in data) {
                if (!Array.isArray(data[key])) {
                    console.warn(`${key} is non-list in soundData!`);
                    continue;
                }

                const list = data[key];
                list.forEach((sound : SoundEffect) => {
                    // Preload each sound file using the name and path from the JSON
                    this.load.audio(sound.name, `${assetPath}/${sound.path}`);
                    SoundLib.addSound('explosion', new Sound(sound.name))
                });
            }
            // Once all the sounds are preloaded, you can continue with the game
            // Optionally, trigger any game logic once loading is complete
            console.log(this.cache.audio.entries.entries);
            console.log("Sounds loaded!");
            this.load.start();
        });

        this.load.start();
        console.log(this.cache.audio.entries.entries);
    }

    create() : void {
        KeyMap.initialize(this);

        // get highscore cookie
        for (const cookie of document.cookie.split("; ")) {
            const [key, value] = cookie.split("=");
            if (key === "highscore") {
                GlobalVars.highScore = parseInt(decodeURIComponent(value));
                break;
            }
        }

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
        this.add.text(hWidth, hHeight + 2 * (UIConfig.borderUISize + UIConfig.borderPadding), `High Score: ${GlobalVars.highScore}`, menuConfig).setOrigin(0.5);
    }

    update() : void {
        if (Phaser.Input.Keyboard.JustDown(KeyMap.keyLEFT)) {
            // easy mode
            GlobalVars.shipSpeed        = 3,
            GlobalVars.gameTimer        = 60000;
            GlobalVars.speedupFactor    = 1.35;
            GlobalVars.hitBonus         = 2000;
            GlobalVars.hitPenalty       = 0;
            GlobalVars.strafe           = 0.8;

            this.sound.play('sfx-select');
            this.scene.start('PlayScene');
        };
        if (Phaser.Input.Keyboard.JustDown(KeyMap.keyRIGHT)) {
            // hard mode
            GlobalVars.shipSpeed        = 4;
            GlobalVars.gameTimer        = 45000;
            GlobalVars.speedupFactor    = 1.75;
            GlobalVars.hitBonus         = 1000;
            GlobalVars.hitPenalty       = 2000;
            GlobalVars.strafe           = 0.4;

            this.sound.play('sfx-select');
            this.scene.start('PlayScene');
        }
    }
}
