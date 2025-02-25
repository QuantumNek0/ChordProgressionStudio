import { getMidiValue, getNoteName, getOctaveRange, getSharpToFlat } from './theory.js';
export var NUMBER_NOTES = 7;
export class Chord {
    async loadAudioBuffer(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await this.audioContext.decodeAudioData(arrayBuffer);
    }
    async initAudio() {
        // this.root.audio_element = new Audio(this.root.audio_path);
        // this.third.audio_element = new Audio(this.third.audio_path);
        // this.fifth.audio_element = new Audio(this.fifth.audio_path);
        // if (this.seventh != undefined) {
        //     this.seventh.audio_element = new Audio(this.seventh.audio_path);
        // }
        this.audioContext = new AudioContext();
        this.buffers['root'] = await this.loadAudioBuffer(this.root.audio_path);
        this.buffers['third'] = await this.loadAudioBuffer(this.third.audio_path);
        this.buffers['fifth'] = await this.loadAudioBuffer(this.fifth.audio_path);
        if (this.seventh) {
            this.buffers['seventh'] = await this.loadAudioBuffer(this.seventh.audio_path);
        }
    }
    constructor(notes, type) {
        this.buffers = {};
        this.root = notes[0];
        this.third = notes[1];
        this.fifth = notes[2];
        if (typeof notes[3] != undefined) {
            this.seventh = notes[3];
        }
        this.type = type;
        this.initAudio();
    }
    playBuffer(buffer) {
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start(0);
    }
    play() {
        // this.root.audio_element.currentTime = 0;
        // this.third.audio_element.currentTime = 0;
        // this.fifth.audio_element.currentTime = 0;
        // if (this.seventh != undefined) this.seventh.audio_element.currentTime = 0;
        // this.root.audio_element.play();
        // this.third.audio_element.play();
        // this.fifth.audio_element.play();
        // if (this.seventh != undefined) this.seventh.audio_element.play();
        if (this.buffers['root']) {
            this.playBuffer(this.buffers['root']);
        }
        if (this.buffers['third']) {
            this.playBuffer(this.buffers['third']);
        }
        if (this.buffers['fifth']) {
            this.playBuffer(this.buffers['fifth']);
        }
        if (this.seventh && this.buffers['seventh']) {
            this.playBuffer(this.buffers['seventh']);
        }
    }
    getNotes() {
        return [this.root, this.third, this.fifth];
    }
}
export function createChord(chord_name) {
    console.log("Create chord has been called!");
    const chord_elements = getNotationElements(chord_name);
    const note = chord_elements.root;
    const accidental = chord_elements.accidental;
    let octave = chord_elements.octave;
    let octave_range = getOctaveRange(octave);
    console.log(`octave_range['end']: ${octave_range[1]}`);
    let notes = [];
    let current_note;
    current_note = getNoteName(getMidiValue(note + accidental + octave));
    const midi_value = getThirds(note + accidental + octave, chord_elements.type, chord_elements.has_seventh);
    console.log(`midi_value: ${midi_value}`);
    // No numbers
    current_note = (getNoteName(midi_value[0])).replace(/[0-9]/g, '');
    const root = {
        midi_value: midi_value[0],
        audio_path: `../../../sounds/notes/oct${octave}_${current_note}.wav?raw=true`
    };
    notes.push(root);
    console.log(`Pushing: ${getNoteName(midi_value[0])}`);
    if (midi_value[1] >= octave_range[1]) {
        octave++;
        octave_range = getOctaveRange(octave);
    }
    current_note = (getNoteName(midi_value[1])).replace(/[0-9]/g, '');
    const third = {
        midi_value: midi_value[1],
        audio_path: `../../../sounds/notes/oct${octave}_${current_note}.wav?raw=true`
    };
    notes.push(third);
    console.log(`Pushing: ${getNoteName(midi_value[1])}`);
    if (midi_value[2] >= octave_range[1]) {
        octave++;
        octave_range = getOctaveRange(octave);
    }
    current_note = (getNoteName(midi_value[2])).replace(/[0-9]/g, '');
    const fifth = {
        midi_value: midi_value[2],
        audio_path: `../../../sounds/notes/oct${octave}_${current_note}.wav?raw=true`
    };
    notes.push(fifth);
    console.log(`Pushing: ${getNoteName(midi_value[2])}`);
    if (chord_elements.has_seventh) {
        if (midi_value[3] >= octave_range[1]) {
            octave++;
            octave_range = getOctaveRange(octave);
        }
        current_note = (getNoteName(midi_value[3])).replace(/[0-9]/g, '');
        const seventh = {
            midi_value: midi_value[3],
            audio_path: `../../../sounds/notes/oct${octave}_${current_note}.wav?raw=true`
        };
        notes.push(seventh);
        console.log(`Pushing: ${getNoteName(midi_value[3])}`);
    }
    const chord = new Chord(notes, chord_elements.type);
    return chord;
}
function getThirds(note, type, has_seventh = false) {
    console.log(`note: ${note}`);
    console.log(`note in flat: ${getSharpToFlat(note)}`);
    let thirds = [];
    let midi_root;
    if (note.search(/#/) != -1)
        midi_root = getMidiValue(getSharpToFlat(note));
    else
        midi_root = getMidiValue(note);
    console.log(`midi_root: ${midi_root}`);
    thirds.push(midi_root);
    let midi_third;
    let midi_fifth;
    let midi_seventh;
    switch (type) {
        case "Major":
            // +4 semitones
            midi_third = midi_root + 4;
            // +3 semitones
            midi_fifth = midi_third + 3;
            thirds.push(midi_third);
            thirds.push(midi_fifth);
            if (has_seventh) {
                midi_seventh = midi_fifth + 4;
                thirds.push(midi_seventh);
            }
            break;
        case "Minor":
            // +4 semitones
            midi_third = midi_root + 3;
            // +3 semitones
            midi_fifth = midi_third + 4;
            thirds.push(midi_third);
            thirds.push(midi_fifth);
            if (has_seventh) {
                midi_seventh = midi_fifth + 3;
                thirds.push(midi_seventh);
            }
            break;
        case "Diminished":
            // +4 semitones
            midi_third = midi_root + 3;
            // +3 semitones
            midi_fifth = midi_third + 3;
            thirds.push(midi_third);
            thirds.push(midi_fifth);
            if (has_seventh) {
                midi_seventh = midi_fifth + 3;
                thirds.push(midi_seventh);
            }
            break;
        default:
            console.warn("Chord type undefined.");
    }
    return thirds;
}
export function getNotationElements(notation) {
    let aux_str;
    let octave;
    if (notation.search(/ /) != -1) {
        aux_str = notation.split(' ', 2);
        octave = aux_str[1];
    }
    else {
        aux_str.push(notation);
        octave = undefined;
    }
    const name = aux_str[0];
    const root = aux_str[0][0];
    const is_diminished = aux_str[0].search(/dim/);
    const is_minor = aux_str[0].search(/m/);
    const has_flat = aux_str[0].search(/b/);
    const has_sharp = aux_str[0].search(/#/);
    const has_seventh = aux_str[0].search(/7/);
    let type;
    let accidental;
    let seventh;
    if (is_minor == -1)
        type = "Major";
    else if (is_diminished != -1)
        type = "Diminished";
    else
        type = "Minor";
    if (has_flat != -1)
        accidental = name[has_flat];
    else if (has_sharp != -1)
        accidental = name[has_sharp];
    else
        accidental = '';
    if (has_seventh != -1)
        seventh = true;
    else
        seventh = false;
    const chord_elements = {
        name: name,
        root: root,
        has_seventh: seventh,
        type: type,
        accidental: accidental,
        octave: +octave
    };
    return chord_elements;
}
