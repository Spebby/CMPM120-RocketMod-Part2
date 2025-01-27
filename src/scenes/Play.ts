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
    private ship01    : Spaceship;
    private ship02    : Spaceship;
    private ship03    : Spaceship;
    private p1Score   : number;

    private scoreLeft : Phaser.GameObjects.Text;
    private clock : Phaser.Time.TimerEvent;

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

          // add spaceships (x3)
        this.ship01 = new Spaceship(this, width + UIConfig.borderUISize * 6, UIConfig.borderUISize * 4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, width + UIConfig.borderUISize * 3, UIConfig.borderUISize * 5 + UIConfig.borderPadding * 2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, width, UIConfig.borderUISize * 6 + UIConfig.borderPadding * 4, 'spaceship', 0, 10).setOrigin(0,0);

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
        this.clock = this.time.delayedCall(GlobalVars.gameTimer, () => {
            this.add.text(width/2, height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(width/2, height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(KeyMap.keyRESET)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(KeyMap.keyLEFT)) {
            this.scene.start("MenuScene");
        }

        this.starfield.tilePositionX -= 4;

        if(!this.gameOver) {
            this.p1Rocket.update();  // update rocket sprite        
            this.ship01.update();    // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
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

    shipExplode(ship : Spaceship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode')             // play explode animation
        boom.on('animationcomplete', () => {   // callback after anim completes
          ship.reset();                        // reset ship position
          ship.alpha = 1;                      // make ship visible again
          boom.destroy();                      // remove explosion sprite
        })
        // score add and text update
        this.p1Score += ship.getPoints();
        this.scoreLeft.text = String(this.p1Score);
        
        this.sound.play('sfx-explosion');
    }
}
