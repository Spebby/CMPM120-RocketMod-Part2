export class Sound {
    name: string;
    weight: number;
  
    constructor(name: string, weight?: number) {
        this.name = name;
        this.weight = weight ?? 1;
    }
}
  
export class SoundLib {
    // Dictionary where each key corresponds to an array of Sounds
    private static sounds: { [key: string] : Sound[] } = {};
  
    // Add sounds to the dictionary under a specific key
    static addSound(key: string, sound: Sound) : void;
    static addSound(key: string, sfx : string, weight: number) : void;
    static addSound(key: string, arg1: Sound | string, weight?: number): void {
        if (arg1 instanceof Sound) {
            if (!SoundLib.sounds[key]) {
                SoundLib.sounds[key] = [];
            }
            SoundLib.sounds[key].push(arg1);
        }
        // If the second argument is a string (sound name) and a weight
        else if (typeof arg1 === 'string' && weight !== null) {
            if (!SoundLib.sounds[key]) {
                SoundLib.sounds[key] = [];
            }
            SoundLib.sounds[key].push(new Sound(arg1, weight));
        } else {
            console.error("Invalid arguments provided to addSound.");
        }
    }
  
    // Get a random sound based on the weight of each sound
    static randSound(key: string) : string | null {
        const soundList = SoundLib.sounds[key];
        if (!soundList) {
            console.warn(`No sounds found for key: ${key}`);
            return null;
        }
    
        // Calculate total weight
        const totalWeight = soundList.reduce((sum, sound) => sum + sound.weight, 0);
    
        // Randomly pick a sound based on the weight
        let randomValue = Math.random() * totalWeight;
        for (const sound of soundList) {
            randomValue -= sound.weight;
            if (randomValue <= 0) {
                return sound.name;
            }
        }
    
        // In case something goes wrong, return null
        return null;
    }
  
    // Get a random sound without considering weight (uniform random)
    static randSoundUnweight(key: string) : string | null {
        const soundList = SoundLib.sounds[key];
        if (!soundList) {
            console.warn(`No sounds found for key: ${key}`);
            return null;
        }
    
        return soundList[Math.floor(Math.random() * soundList.length)].name;
    }
}