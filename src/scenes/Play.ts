import { GameConfig } from '../config';
import { UIConfig } from '../config';
import { KeyMap } from '../keymap';
import { Rocket } from '../objects/rocket';
import { Spaceship } from '../objects/spaceship';
import { GlobalVars } from "../global";
import { FastShip } from '../objects/fastShip';

interface TextConfig {
    fontFamily: string;
    fontSize: string;
    backgroundColor: string;
    color: string;
    align: string;
    padding: {
        top: number;
        bottom: number;
    };
    fixedWidth: number;
}

interface shipconf {
    x : number;
    y : number;
    points: number;
}

let scoreConfig : TextConfig;
let width  : number;
let height : number;

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
    private hClock    : Phaser.Time.TimerEvent;
    private fClock    : Phaser.Time.TimerEvent;

    private gameOver : boolean;
    private playerWasFiring : boolean;

    create() : void {
        KeyMap.initialize(this);
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        width  = parseInt(GameConfig.scale.width  as string);
        height = parseInt(GameConfig.scale.height as string);

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

        let cords : shipconf[] = [
            {x: width + UIConfig.borderUISize * 6, y: UIConfig.borderUISize * 4, points: 10},
            {x: width + UIConfig.borderUISize * 3, y: UIConfig.borderUISize * 5 + UIConfig.borderPadding * 2, points: 20},
            {x: width, y: UIConfig.borderUISize * 6 + UIConfig.borderPadding * 4, points: 30}
        ];

        let fastShipIndex : number = -1;
        if (GlobalVars.hardmode || Math.random () > 0.25) {
            fastShipIndex = Math.floor(Math.random() * 3);
        }

        for (const [i, cord] of cords.entries()) {
            if (i == fastShipIndex) {
                this.ships.push(new FastShip(this, cord.x, cord.y, 'fastship',  0, cord.points * 1.25));
            } else {
                this.ships.push(new Spaceship(this, cord.x, cord.y, 'spaceship', 0, cord.points));
            }
        }
        // entierly unneeded to do a seperate object for this but I feel like it to screw around with polymorphism.

        // initialize score
        this.p1Score = 0;

        // display score
        scoreConfig = {
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
        this.hClock = this.time.addEvent({
            delay: GlobalVars.gameTimer / 2,
            callback: this.halfClockHandler,
            callbackScope: this,
            loop: false,
        });

        this.fClock = this.time.addEvent({
            delay: GlobalVars.gameTimer,
            callback: this.gameOverHandler,
            loop: false,
        });

        // timer
        let screenWidth : number = parseInt(GameConfig.scale.width as string);
        this.timeRight = this.add.text(screenWidth - (UIConfig.borderUISize + UIConfig.borderPadding * 9), UIConfig.borderUISize + UIConfig.borderPadding * 2, '', scoreConfig);
        
        this.events.on('shipDied', this.incrementPoints, this);
    }

    gameOverHandler() : void {
        this.add.text(width/2, height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
        this.add.text(width/2, height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
        this.gameOver = true;
        GlobalVars.shipSpeed *= 1/GlobalVars.speedupFactor;

        if (this.p1Score > GlobalVars.highScore) {
            GlobalVars.highScore = this.p1Score;
            const expires = "expires=Fri, 31 Dec 9999 23:59:59 GMT"; // Far-future expiration date
            document.cookie = `highscore=${this.p1Score}; ${expires}; path=/`;
            this.add.text(width/2, height/2 + 128, 'New High Score!', scoreConfig).setOrigin(0.5);
        }
    }

    halfClockHandler() : void {
        GlobalVars.shipSpeed *= GlobalVars.speedupFactor;
        this.ships.forEach(ship => {
            ship.resetSpeed();
        });
    }

    update(time : number, delta : number) {
        this.timeRight.text = String(Math.max(0, this.fClock.getRemainingSeconds()).toFixed(2));

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

        let isPlayerFiring = this.p1Rocket.isFiring();
        // don't do any of the other checks.
        if (!this.playerWasFiring && !isPlayerFiring) {
            if (!this.p1Rocket.hasHit) {
                let timer = this.fClock.getRemaining() - GlobalVars.hitPenalty;
                this.fClock.reset({
                    delay: timer,
                    callback: this.gameOverHandler,
                    callbackScope: this,
                    loop: false,
                });
                this.p1Rocket.hasHit = true;
            }
            this.playerWasFiring = true;
        } else if (!isPlayerFiring) {
            this.playerWasFiring = false;
            return;
        }

        // collision check
        for (const ship of this.ships) {
            if (this.checkCollision(this.p1Rocket, ship)) {
                ship.onDeath();
                ship.reset();

                // apply hit bonus
                let timer = this.fClock.getRemaining() + GlobalVars.hitBonus;
                this.fClock.reset({
                    delay: timer,
                    callback: this.gameOverHandler,
                    callbackScope: this,
                    loop: false,
                });

                this.p1Rocket.hasHit = true;
                break;
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
