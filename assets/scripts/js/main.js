import { newChord, NUMBER_NOTES } from './music.js';
import { getScaleChords } from './theory.js';
// DOM variables
var pad_chords = [];
var load_progress = 0;
// DOM elements
const html_loadingText = document.getElementById("load-text");
const html_loadingOverlay = document.getElementById("loading");
const html_flipOverlay = document.getElementById("not-portrait");
// screen size query
var media_query = window.matchMedia("(max-width: 380px)");
async function updateChord(pad_number, new_chord, load_screen = true) {
    if (load_screen) {
        showLoadScreen(true);
        load_progress = 0;
        const current_chord = document.getElementById("Chord" + pad_number);
        current_chord.innerHTML = new_chord;
        updateProgress(100);
        const chord = newChord(new_chord);
        await chord.initAudio();
        pad_chords[pad_number - 1] = chord;
        showLoadScreen(false);
    }
    else {
        const current_chord = document.getElementById("Chord" + pad_number);
        current_chord.innerHTML = new_chord;
        const chord = newChord(new_chord);
        await chord.initAudio();
        pad_chords[pad_number - 1] = chord;
    }
}
async function updateKey(new_key) {
    showLoadScreen(true);
    const current_key = document.getElementById("key");
    current_key.innerHTML = new_key;
    const key_chords = getScaleChords(new_key);
    load_progress = 0;
    for (let i = 0; i < NUMBER_NOTES; i++) {
        updateProgress(100 / NUMBER_NOTES);
        const chord_name = key_chords[i] + " 3";
        await updateChord(i + 1, chord_name, false);
    }
    showLoadScreen(false);
}
function playPad(pad_number) {
    pad_chords[pad_number - 1].play();
}
function showLoadScreen(display) {
    if (display) {
        html_loadingOverlay.style.display = "block";
        html_flipOverlay.style.display = "none";
    }
    else {
        html_loadingOverlay.style.display = "none";
        if (media_query.matches)
            html_flipOverlay.style.display = "block";
    }
}
function requestFlip(query) {
    if (query.matches) { // screen size matches (380px or smaller)
        html_flipOverlay.style.display = "block";
    }
    else {
        html_flipOverlay.style.display = "none";
    }
}
requestFlip(media_query);
async function updateProgress(progress) {
    load_progress += progress;
    html_loadingText.innerText = `Loading sounds ${Math.round(load_progress)}%`;
}
window.updateChord = updateChord;
window.updateKey = updateKey;
window.playPad = playPad;
// Ensure innitBuffer is called after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async (event) => {
    await updateKey("C");
});
media_query.addEventListener("change", function () {
    requestFlip(media_query);
});
