import { createChord, NUMBER_NOTES } from './music.js';
import { getScaleChords } from './theory.js';
var pad_chords = [];
function innitBuffer() {
    for (let i = 0; i < NUMBER_NOTES; i++) {
        let chord_element = document.getElementById("Chord" + (i + 1));
        let chord_name = chord_element.innerHTML.replace(/<[^>]*>/g, ''); // Remove HTML tags
        let chord = createChord(chord_name);
        console.log(`Creating chord for pad ${i + 1}: ${chord_name}`);
        console.log(`Chord created:`, chord.getNotes());
        pad_chords.push(chord);
    }
}
function updateChord(pad_number, new_chord) {
    const current_chord = document.getElementById("Chord" + pad_number);
    current_chord.innerHTML = new_chord;
    pad_chords[pad_number - 1] = createChord(new_chord);
}
function updateKey(new_key) {
    const current_key = document.getElementById("key");
    current_key.innerHTML = new_key;
    const key_chords = getScaleChords(new_key);
    for (let i = 0; i < NUMBER_NOTES; i++) {
        updateChord(i + 1, key_chords[i] + " 3");
    }
}
function playPad(pad_number) {
    console.log(`Playing Pad ${pad_number}`);
    const pad = pad_chords[pad_number - 1];
    const notes = pad.getNotes();
    console.log(`Root: ${notes[0].audio_path}`);
    console.log(`Third: ${notes[1].audio_path}`);
    console.log(`Fifth: ${notes[2].audio_path}`);
    pad.play();
}
window.innitBuffer = innitBuffer;
window.updateChord = updateChord;
window.updateKey = updateKey;
window.playPad = playPad;
// Ensure innitBuffer is called after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
    innitBuffer();
});
