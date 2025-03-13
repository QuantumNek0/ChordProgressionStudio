// import { Worker } from "node:worker_threads"

import {
    Chord,
    newChord,
    NUMBER_NOTES

} from './music.js';

import { getScaleChords } from './theory.js';

// DOM variables
var pad_chords: Chord[] = [];
var multi_thread = (typeof(Worker) !== "undefined");
// var multi_thread = false;

// overlays
const loading_screen = document.getElementById("loading");
const small_screen = document.getElementById("not-portrait");

// screen size query
var media_query = window.matchMedia("(max-width: 380px)");

async function innitAudioBuffers(chords: Chord[]) {

    const t0 = performance.now();
    let completed_workers = 0;

    if (multi_thread) {
        const initialized_chords = [];

        chords.forEach((pad, i) => {
            const worker = new Worker("assets/scripts/js/buffer_load.js");
            worker.postMessage(pad);
            console.log("Task assigned");

            worker.onmessage = (event) => {
                console.log(event.data);
                completed_workers++;
                initialized_chords.push(event.data);

                if (completed_workers === NUMBER_NOTES) {

                    const t1 = performance.now();
                    console.log(`${completed_workers} workers took ${t1 - t0} ms.`);
                    process.exit();
                }
            };
        });
        chords = initialized_chords;

    } else {

        for (let pad in chords) 
            await chords[pad].initAudio();

        const t1 = performance.now();
        console.log(`Single thread took ${t1 - t0} ms.`);
    }
}

async function updateChord(pad_number: number, new_chord: string) {

    showLoadScreen(true);
    const current_chord = document.getElementById("Chord" + pad_number);
    current_chord.innerHTML = new_chord;

    const chord = newChord(new_chord)
    await chord.initAudio();

    pad_chords[pad_number - 1] = chord;
    showLoadScreen(false);
}

async function updateKey(new_key: string) {

    showLoadScreen(true);
    const current_key = document.getElementById("key")
    current_key.innerHTML = new_key

    const key_chords = getScaleChords(new_key);

    const new_pad_chords = [];
    for (let i = 0; i < NUMBER_NOTES; i++) {

        const chord_name = key_chords[i] + " 3";
        new_pad_chords.push(newChord(chord_name));
    }
    await innitAudioBuffers(new_pad_chords);
    pad_chords = new_pad_chords;

    showLoadScreen(false);
}

function playPad(pad_number: number) {

    const pad = pad_chords[pad_number - 1];
    pad.play();
}

function showLoadScreen(display: boolean) {
    if (display) {
        loading_screen.style.display = "block";
        small_screen.style.display = "none"

    } else {
        loading_screen.style.display = "none";

        if (media_query.matches)
            small_screen.style.display = "block"
    }
}

function requestFlip(query: MediaQueryList) {
    if (query.matches) { // screen size matches (380px or smaller)

        small_screen.style.display = "block"
    } else {
        small_screen.style.display = "none"
    }
}
requestFlip(media_query);

(window as any).updateChord = updateChord;
(window as any).updateKey = updateKey;
(window as any).playPad = playPad;

// Ensure innitBuffer is called after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async (event) => {
    await updateKey("C");
});

media_query.addEventListener("change", function() {
    requestFlip(media_query);
});
