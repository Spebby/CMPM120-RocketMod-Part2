// global to get around prof's hack-y use of game config.

// global.d.ts
declare global {
    let shipSpeed: number;
    let gameTimer: number;
}

export let GlobalVars = {
    shipSpeed : 0,
    gameTimer : 0
};