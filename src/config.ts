import { MenuScene } from './scenes/Menu';
import { PlayScene } from './scenes/Play';

export const GameConfig : Phaser.Types.Core.GameConfig = {
    title: 'Rocket Mod',
    url: 'https://github.com/Spebby/CMPM120-RocketMod',
    version: '0.0.1',
    backgroundColor: 0x3a404d,
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.MAX_ZOOM,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        parent: 'game',
        width: 640,
        height: 480
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 100 }
        }
    },
    scene: [MenuScene, PlayScene],
    input: {
        keyboard: true
    },
    render: { pixelArt: true }
};

export const UIConfig : { borderUISize: number, borderPadding: number } = {
    borderUISize: (parseInt(GameConfig.scale.height as string) || window.innerHeight) / 15,
    borderPadding: ((parseInt(GameConfig.scale.height as string) || window.innerHeight) / 15) / 3
};
