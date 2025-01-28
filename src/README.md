# Changelog from Part 1

The following is a required per assignment instructions.

This is Thom Mott's submission for the Rocket Patrol Mod assignment, or "Thom's Rocket Patrol Mod".
This part took roughly 5-6 hours of work. The modifications I chose from the list were:

    * Track a high score that persists across scenes and display it in the UI (1)
        * I also save this high score between sessions in a cookie.
    * Implement the speed increase that happens after 30 seconds in the original game (1)
        * In hard mode it happens 22.5 seconds in.
    * Randomize each spaceship's movement direction at the start of each play (1)
        * Every time a ship is destroyed, the direction is shuffled again.
    * Allow the player to control the Rocket after it's fired (1)
        * You have 80% control on Normal mode, and 40% control on hardmode.
    * Create 4 new explosion sound effects and randomize which one plays on impact (3)
        * For 5 total. The implementaiton uses a static "Sound Library" class for managing SFX.
    * Display the time remaining (in seconds) on the screen (3)
    * Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)
        * It can replace one of the 3 ships. It has a 25% chance to do so on normal mode, and is garuanteed on hardmode.
    * Implement a new timing/scoring mechanism that adds time to the clock for successful hits and subtracts time for misses 
        * For normal mode, there is a 1.25 second bonus for a successful hit and a 0.5 second penalty for a miss.
        * For hardmode, there is a 0.5 second bonus, and a 2 second penalty.

yarn and TS boilerplate was provided by digitsensitive's [phaser3-typescript](https://github.com/digitsensitive/phaser3-typescript/tree/master) project.