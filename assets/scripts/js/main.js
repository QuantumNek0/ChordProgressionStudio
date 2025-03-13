import { createChord, NUMBER_NOTES } from './music.js';
import { getScaleChords } from './theory.js';
// Audio Buffer
var pad_chords = [];
// const buttons = document.querySelectorAll(".dropbtn");
const loading_screen = document.getElementById("loading");
const small_screen = document.getElementById("not-portrait");
// Create a MediaQueryList object
var media_query = window.matchMedia("(max-width: 380px)");
async function innitBuffer() {
    for (let i = 0; i < NUMBER_NOTES; i++) {
        let chord_element = document.getElementById("Chord" + (i + 1));
        let chord_name = chord_element.innerHTML.replace(/<[^>]*>/g, ''); // Remove HTML tags
        let chord = await createChord(chord_name);
        // console.log(`Creating chord for pad ${i + 1}: ${chord_name}`);
        // console.log(`Chord created:`, chord.getNotes());
        pad_chords.push(chord);
    }
}
async function updateChord(pad_number, new_chord) {
    showLoadScreen(true);
    const current_chord = document.getElementById("Chord" + pad_number);
    current_chord.innerHTML = new_chord;
    pad_chords[pad_number - 1] = await createChord(new_chord);
    showLoadScreen(false);
}
async function updateKey(new_key) {
    showLoadScreen(true);
    const current_key = document.getElementById("key");
    current_key.innerHTML = new_key;
    const key_chords = getScaleChords(new_key);
    for (let i = 0; i < NUMBER_NOTES; i++) {
        await updateChord(i + 1, key_chords[i] + " 3");
    }
    showLoadScreen(false);
}
function playPad(pad_number) {
    // console.log(`Playing Pad ${pad_number}`);
    const pad = pad_chords[pad_number - 1];
    // const notes = pad.getNotes();
    // console.log(`Root: ${notes[0].audio_path}`);
    // console.log(`Third: ${notes[1].audio_path}`);
    // console.log(`Fifth: ${notes[2].audio_path}`);
    pad.play();
}
function showLoadScreen(display) {
    if (display) {
        loading_screen.style.display = "block";
        small_screen.style.display = "none";
        // buttons.forEach(a => (a as HTMLElement).style.display = "none");
    }
    else {
        loading_screen.style.display = "none";
        if (media_query.matches)
            small_screen.style.display = "block";
        // buttons.forEach(a => (a as HTMLElement).style.display = "initial");
    }
}
function requestFlip(query) {
    if (query.matches) { // If media query matches
        small_screen.style.display = "block";
    }
    else {
        small_screen.style.display = "none";
    }
}
requestFlip(media_query);
window.innitBuffer = innitBuffer;
window.updateChord = updateChord;
window.updateKey = updateKey;
window.playPad = playPad;
// Ensure innitBuffer is called after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async (event) => {
    showLoadScreen(true);
    await innitBuffer();
    showLoadScreen(false);
});
// Attach listener function on state changes
media_query.addEventListener("change", function () {
    requestFlip(media_query);
});
