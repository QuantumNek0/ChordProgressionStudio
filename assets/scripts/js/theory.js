// Map for note names to MIDI values
const sharpToFlat = new Map([
    ["C2", "C2"], ["C#2", "Db2"], ["D2", "D2"], ["D#2", "Eb2"], ["E2", "E2"], ["E#2", "Fb2"], ["F2", "F2"], ["F#2", "Gb2"], ["G2", "G2"], ["G#2", "Ab2"], ["A2", "A2"], ["A#2", "Bb2"], ["B2", "B2"], ["B#2", "Cb2"],
    ["C3", "C3"], ["C#3", "Db3"], ["D3", "D3"], ["D#3", "Eb3"], ["E3", "E3"], ["E#3", "Fb3"], ["F3", "F3"], ["F#3", "Gb3"], ["G3", "G3"], ["G#3", "Ab3"], ["A3", "A3"], ["A#3", "Bb3"], ["B3", "B3"], ["B#3", "Cb3"],
    ["C4", "C4"], ["C#4", "Db4"], ["D4", "D4"], ["D#4", "Eb4"], ["E4", "E4"], ["E#4", "Fb4"], ["F4", "F4"], ["F#4", "Gb4"], ["G4", "G4"], ["G#4", "Ab4"], ["A4", "A4"], ["A#4", "Bb4"], ["B4", "B4"], ["B#4", "Cb4"],
    ["C5", "C5"], ["C#5", "Db5"], ["D5", "D5"], ["D#5", "Eb5"], ["E5", "E5"], ["E#5", "Fb5"], ["F5", "F5"], ["F#5", "Gb5"], ["G5", "G5"], ["G#5", "Ab5"], ["A5", "A5"], ["A#5", "Bb5"], ["B5", "B5"], ["B#5", "Cb5"],
    ["C6", "C6"], ["C#6", "Db5"], ["D6", "D6"], ["D#6", "Eb6"], ["E6", "E6"], ["E#6", "Fb6"], ["F6", "F6"], ["F#6", "Gb6"], ["G6", "G6"], ["G#6", "Ab6"], ["A6", "A6"], ["A#6", "Bb6"], ["B6", "B6"], ["B#6", "Cb6"]
]);
// Map for note names to MIDI values
const noteToMidi = new Map([
    ["C2", 36], ["Db2", 37], ["D2", 38], ["Eb2", 39], ["E2", 40], ["Fb2", 40], ["F2", 41], ["Gb2", 42], ["G2", 43], ["Ab2", 44], ["A2", 45], ["Bb2", 46], ["B2", 47], ["Cb3", 47],
    ["C3", 48], ["Db3", 49], ["D3", 50], ["Eb3", 51], ["E3", 52], ["Fb3", 52], ["F3", 53], ["Gb3", 54], ["G3", 55], ["Ab3", 56], ["A3", 57], ["Bb3", 58], ["B3", 59], ["Cb4", 59],
    ["C4", 60], ["Db4", 61], ["D4", 62], ["Eb4", 63], ["E4", 64], ["Fb4", 64], ["F4", 65], ["Gb4", 66], ["G4", 67], ["Ab4", 68], ["A4", 69], ["Bb4", 70], ["B4", 71], ["Cb5", 71],
    ["C5", 72], ["Db5", 73], ["D5", 74], ["Eb5", 75], ["E5", 76], ["Fb5", 76], ["F5", 77], ["Gb5", 78], ["G5", 79], ["Ab5", 80], ["A5", 81], ["Bb5", 82], ["B5", 83], ["Cb6", 83],
    ["C6", 84], ["Db6", 85], ["D6", 86], ["Eb6", 87], ["E6", 88], ["Fb6", 88], ["F6", 89], ["Gb6", 90], ["G6", 91], ["Ab6", 92], ["A6", 93], ["Bb6", 94], ["B6", 95], ["Cb7", 95]
]);
// Map for MIDI values to note names
const midiToNote = new Map([
    [36, "C2"], [37, "Db2"], [38, "D2"], [39, "Eb2"], [40, "E2"], [40, "Fb2"], [41, "F2"], [42, "Gb2"], [43, "G2"], [44, "Ab2"], [45, "A2"], [46, "Bb2"], [47, "B2"], [47, "Cb3"],
    [48, "C3"], [49, "Db3"], [50, "D3"], [51, "Eb3"], [52, "E3"], [52, "Fb3"], [53, "F3"], [54, "Gb3"], [55, "G3"], [56, "Ab3"], [57, "A3"], [58, "Bb3"], [59, "B3"], [59, "Cb4"],
    [60, "C4"], [61, "Db4"], [62, "D4"], [63, "Eb4"], [64, "E4"], [64, "Fb4"], [65, "F4"], [66, "Gb4"], [67, "G4"], [68, "Ab4"], [69, "A4"], [70, "Bb4"], [71, "B4"], [71, "Cb5"],
    [72, "C5"], [73, "Db5"], [74, "D5"], [75, "Eb5"], [76, "E5"], [76, "Fb5"], [77, "F5"], [78, "Gb5"], [79, "G5"], [80, "Ab5"], [81, "A5"], [82, "Bb5"], [83, "B5"], [83, "Cb6"],
    [84, "C6"], [85, "Db6"], [86, "D6"], [87, "Eb6"], [88, "E6"], [88, "Fb6"], [89, "F6"], [90, "Gb6"], [91, "G6"], [92, "Ab6"], [93, "A6"], [94, "Bb6"], [95, "B6"], [95, "Cb7"]
]);
const octaveRange = new Map([
    [2, [36, 47]],
    [3, [48, 59]],
    [4, [60, 71]],
    [5, [72, 83]],
    [6, [84, 95]]
]);
// Map for scale chords
const ScaleChords = new Map([
    ["C", ["C", "Dm", "Em", "F", "G", "Am", "Bdim"]],
    ["Am", ["Am", "Bdim", "C", "Dm", "Em", "F", "G"]],
    ["G", ["G", "Am", "Bm", "C", "D", "Em", "F#dim"]],
    ["Em", ["Em", "F#dim", "G", "Am", "Bm", "C", "D"]],
    ["D", ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"]],
    ["Bm", ["Bm", "C#dim", "D", "Em", "F#m", "G", "A"]],
    ["A", ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"]],
    ["F#m", ["F#m", "G#dim", "A", "Bm", "C#m", "D", "E"]],
    ["E", ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"]],
    ["C#m", ["C#m", "D#dim", "E", "F#m", "G#m", "A", "B"]],
    ["B", ["B", "C#m", "D#m", "E", "F#", "G#m", "A#dim"]],
    ["G#m", ["G#m", "A#dim", "B", "C#m", "D#m", "E", "F#"]],
    ["F#", ["F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim"]],
    ["D#m", ["D#m", "E#dim", "F#", "G#m", "A#m", "B", "C#"]],
    ["C#", ["C#", "D#m", "E#m", "F#", "G#", "A#m", "B#dim"]],
    ["A#m", ["A#m", "B#dim", "C#", "D#m", "E#m", "F#", "G#"]],
    ["F", ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim"]],
    ["Dm", ["Dm", "Edim", "F", "Gm", "Am", "Bb", "C"]],
    ["Bb", ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim"]],
    ["Gm", ["Gm", "Adim", "Bb", "Cm", "Dm", "Eb", "F"]],
    ["Eb", ["Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim"]],
    ["Cm", ["Cm", "Ddim", "Eb", "Fm", "Gm", "Ab", "Bb"]],
    ["Ab", ["Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim"]],
    ["Fm", ["Fm", "Gdim", "Ab", "Bbm", "Cm", "Db", "Eb"]],
    ["Db", ["Db", "Ebm", "Fm", "Gb", "Ab", "Bbm", "Cdim"]],
    ["Bbm", ["Bbm", "Cdim", "Db", "Ebm", "Fm", "Gb", "Ab"]],
    ["Gb", ["Gb", "Abm", "Bbm", "Cb", "Db", "Ebm", "Fdim"]],
    ["Ebm", ["Ebm", "Fdim", "Gb", "Abm", "Bbm", "Cb", "Db"]],
    ["Cb", ["Cb", "Dbm", "Ebm", "Fb", "Gb", "Abm", "Bdim"]],
    ["Abm", ["Abm", "Bdim", "Cb", "Dbm", "Ebm", "Fb", "Gb"]],
    // Equivalent Major Scales
    ["A#", ["A#", "Cm", "Dm", "D#", "F", "Gm", "Adim"]],
    ["D#", ["D#", "Fm", "Gm", "G#", "A#", "Cm", "Ddim"]],
    ["G#", ["G#", "A#m", "Cm", "C#", "D#", "Fm", "Gdim"]],
    ["Fb", ["Fb", "Gbm", "Abm", "Bbb", "Cb", "Dbm", "Edim"]],
    // Equivalent Minor Scales
    ["Cbm", ["Cbm", "Ddim", "D#", "Fb", "Gb", "Abm", "Bdim"]],
    ["Dbm", ["Dbm", "Ebdim", "Fb", "Gb", "Ab", "Bbm", "Cb"]],
    ["Fbm", ["Fbm", "Gdim", "G#", "Bbb", "Cb", "Dbm", "Edim"]]
]);
// Function to get sharp note name from flat note name
export function getSharpToFlat(note) {
    return sharpToFlat.get(note);
}
// Function to get MIDI value from note name
export function getMidiValue(note) {
    return noteToMidi.get(note);
}
// Function to get note name from MIDI value
export function getNoteName(midi) {
    return midiToNote.get(midi);
}
// Function to get octave range
export function getOctaveRange(octave) {
    return octaveRange.get(octave);
}
// Function to get scale chords
export function getScaleChords(key) {
    return ScaleChords.get(key);
}
