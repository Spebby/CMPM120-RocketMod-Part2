import { GameConfig } from '../config';
import { UIConfig } from '../config';
import { KeyMap } from '../keymap';
import { Rocket } from '../objects/rocket';
import { Spaceship } from '../objects/spaceship';
import { GlobalVars } from "../global";

export class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    private starfield : Phaser.GameObjects.TileSprite;
    private p1Rocket  : Rocket;
    private ships     : Spaceship[];
    private p1Score   : number;

    private scoreLeft : Phaser.GameObjects.Text;
    private timeRight : Phaser.GameObjects.Text;
    private clock     : Phaser.Time.TimerEvent;

    private gameOver : boolean;

    create() : void {
        KeyMap.initialize(this);
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        let width  = parseInt(GameConfig.scale.width  as string);
        let height = parseInt(GameConfig.scale.height as string);

        // green UI background
        this.add.rectangle(0, UIConfig.borderUISize + UIConfig.borderPadding, width, UIConfig.borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, width, UIConfig.borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, height - UIConfig.borderUISize, width, UIConfig.borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, UIConfig.borderUISize, height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(width - UIConfig.borderUISize, 0, UIConfig.borderUISize, height, 0xFFFFFF).setOrigin(0, 0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, width / 2, height - UIConfig.borderUISize - UIConfig.borderPadding, 'rocket').setOrigin(0.5, 0);

        this.ships = [];
        // add spaceships (x3)
        this.ships.push(new Spaceship(this, width + UIConfig.borderUISize * 6,  UIConfig.borderUISize * 4,                              'spaceship', 0, 30).setOrigin(0, 0));
        this.ships.push(new Spaceship(this, width + UIConfig.borderUISize * 3,  UIConfig.borderUISize * 5 + UIConfig.borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0));
        this.ships.push(new Spaceship(this, width,                              UIConfig.borderUISize * 6 + UIConfig.borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0));

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        };

        this.scoreLeft = this.add.text(UIConfig.borderUISize + UIConfig.borderPadding, UIConfig.borderUISize + UIConfig.borderPadding * 2, String(this.p1Score), scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;

        // half clock ship speedup
        this.clock = this.time.delayedCall(GlobalVars.gameTimer / 2, () => {
            GlobalVars.shipSpeed *= 2;
            this.ships.forEach(ship => {
                ship.resetSpeed();
            });
        }, null, this);

        this.clock = this.time.delayedCall(GlobalVars.gameTimer, () => {
            this.add.text(width/2, height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(width/2, height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            GlobalVars.shipSpeed *= 0.5;
            if (this.p1Score > GlobalVars.highScore) {
                GlobalVars.highScore = this.p1Score;
                this.add.text(width/2, height/2 + 128, 'New High Score!', scoreConfig).setOrigin(0.5);
            }
        }, null, this);

        // timer
        let screenWidth  = parseInt(GameConfig.scale.width as string);
        this.timeRight = this.add.text(screenWidth - (UIConfig.borderUISize + UIConfig.borderPadding * 9), UIConfig.borderUISize + UIConfig.borderPadding * 2, '', scoreConfig);
        
        this.events.on('shipDied', this.incrementPoints, this);
    }

    update(time : number, delta : number) {
        this.timeRight.text = String(Math.max(0, (GlobalVars.gameTimer - this.clock.elapsed) / 1000).toFixed(2));

        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(KeyMap.keyRESET)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(KeyMap.keyLEFT)) {
            this.scene.start("MenuScene");
        }


        if(!this.gameOver) {
            this.starfield.tilePositionX -= 4;
            this.p1Rocket.update(time, delta);  // update rocket sprite
            for (const ship of this.ships) {
                ship.update(time, delta);
            }
        }


        // collision check
        for (const ship of this.ships) {
            if (this.checkCollision(this.p1Rocket, ship)) {
                ship.onDeath();
                ship.reset();
            }
        }
    }

    checkCollision(rocket : Rocket, ship : Spaceship) {
        // simple AABB checking
        // gross
        if (rocket.x < ship.x + ship.width && 
          rocket.x + rocket.width > ship.x && 
          rocket.y < ship.y + ship.height &&
          rocket.height + rocket.y > ship. y) {
          return true;
        } else {
          return false;
        }
    }

    incrementPoints(points: number) : void {
        this.p1Score += points;
        this.scoreLeft.text = String(this.p1Score);
    }
}
