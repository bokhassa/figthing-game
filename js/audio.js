//TODO add "menu" music, battle music and sound effects
const audio = {
    Battle: new Howl({
        src: './audio/battle music.mp3',
        html5: true,
        volume: 0.1
    }),
    hit1: new Howl({
        src: './audio/hit.wav',
        html5: true,
        volume: 0.1
    }),
    hit2: new Howl({
        src: './audio/hit2.wav',
        html5: true,
        volume: 0.1
    }),
    hit3: new Howl({
        src: './audio/hit3.wav',
        html5: true,
        volume: 0.3
    }),
    victory: new Howl({
        src: './audio/victory.wav',
        html5: true,
        volume: 0.1
    })
};