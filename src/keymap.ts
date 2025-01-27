// Define a KeyMap class with static properties
export class KeyMap {
    static keyUP:    Phaser.Input.Keyboard.Key;
    static keyDOWN:  Phaser.Input.Keyboard.Key;
    static keyLEFT:  Phaser.Input.Keyboard.Key;
    static keyRIGHT: Phaser.Input.Keyboard.Key;
    static keyFIRE:  Phaser.Input.Keyboard.Key;
    static keyRESET: Phaser.Input.Keyboard.Key;

    static initialize(scene: Phaser.Scene) {
        KeyMap.keyUP    = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        KeyMap.keyDOWN  = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        KeyMap.keyLEFT  = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        KeyMap.keyRIGHT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        KeyMap.keyFIRE  = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        KeyMap.keyRESET = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }
}


