// global to get around prof's hack-y use of game config.
// supposed to be a .d.ts file, but had some weird issues with it.

declare global {
    let shipSpeed: number;
    let gameTimer: number;
    let highScore: number;
    let speedupFactor : number;
    let hitBonus   : number;
    let hitPenalty : number;
    let strafe     : number;
    let hardmode   : boolean;
}

export let GlobalVars = {
    shipSpeed  : 0,
    gameTimer  : 0,
    highScore  : 0,
    speedupFactor : 1.5,
    hitBonus   : 0,
    hitPenalty : 0,
    strafe     : 0,
    hardmode   : false,
};