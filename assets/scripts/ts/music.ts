import { getMidiValue, getNoteName, getOctaveRange, getSharpToFlat } from './theory.js';

export var NUMBER_NOTES = 7;

export class Chord {

    private root: Note;
    private third: Note;
    private fifth: Note;
    private seventh?: Note;

    // private type: string;
    private audioContext: AudioContext;
    private buffers: { [key: string]: AudioBuffer } = {};

    private async loadAudioBuffer(url: string): Promise<AudioBuffer> {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await this.audioContext.decodeAudioData(arrayBuffer);
    }

    public async initAudio() {

        this.audioContext = new AudioContext();

        this.buffers['root'] = await this.loadAudioBuffer(this.root.audio_path);
        this.buffers['third'] = await this.loadAudioBuffer(this.third.audio_path);
        this.buffers['fifth'] = await this.loadAudioBuffer(this.fifth.audio_path);

        if (this.seventh) {
            this.buffers['seventh'] = await this.loadAudioBuffer(this.seventh.audio_path);
        }
    }

    public constructor(notes: Note[]) {

        this.root = notes[0];
        this.third = notes[1];
        this.fifth = notes[2];

        if (typeof notes[3] != undefined) {

            this.seventh = notes[3];
        }
        // this.type = type;
    }

    private playBuffer(buffer: AudioBuffer) {
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start(0);
    }

    play(): void {

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

    getNotes(): Note[] {

        return [this.root, this.third, this.fifth];
    }
}

export interface Note {

    midi_value: number,
    audio_path: string,
    audio_element?: HTMLAudioElement
}

export interface NotationElements {

    name: string,
    root: string,
    has_seventh: boolean,
    type: string,
    accidental: string,
    octave: number
}

export function newChord(chord_name: string): Chord {

    const chord_elements = getNotationElements(chord_name);
    const note = chord_elements.root;
    const accidental = chord_elements.accidental;

    let octave = chord_elements.octave;
    let octave_range = getOctaveRange(octave);

    let notes: Note[] = [];
    let current_note: string;

    current_note = getNoteName(getMidiValue(note + accidental + octave))
    const midi_value = getThirds(note + accidental + octave, chord_elements.type, chord_elements.has_seventh);

    // remove numbers in chord name
    current_note = (getNoteName(midi_value[0])).replace(/[0-9]/g, '');

    const root: Note = {

        midi_value: midi_value[0],
        audio_path: `sounds/notes/oct${octave}_${current_note}.wav?raw=true`
    };
    notes.push(root);

    if (midi_value[1] >= octave_range[1]) {

        octave++;
        octave_range = getOctaveRange(octave);
    }

    current_note = (getNoteName(midi_value[1])).replace(/[0-9]/g, '');
    const third: Note = {

        midi_value: midi_value[1],
        audio_path: `sounds/notes/oct${octave}_${current_note}.wav?raw=true`
    };
    notes.push(third);

    if (midi_value[2] >= octave_range[1]) {

        octave++;
        octave_range = getOctaveRange(octave);
    }

    current_note = (getNoteName(midi_value[2])).replace(/[0-9]/g, '');
    const fifth: Note = {

        midi_value: midi_value[2],
        audio_path: `sounds/notes/oct${octave}_${current_note}.wav?raw=true`
    };
    notes.push(fifth);

    if (chord_elements.has_seventh) {

        if (midi_value[3] >= octave_range[1]) {

            octave++;
            octave_range = getOctaveRange(octave);
        }

        current_note = (getNoteName(midi_value[3])).replace(/[0-9]/g, '');
        const seventh: Note = {

            midi_value: midi_value[3],
            audio_path: `sounds/notes/oct${octave}_${current_note}.wav?raw=true`
        };
        notes.push(seventh);
    }
    const chord = new Chord(notes)

    return chord;
}

function getThirds(note: string, type: string, has_seventh: boolean = false): number[] {

    let thirds: number[] = [];
    let midi_root: number;

    if (note.search(/#/) != -1) midi_root = getMidiValue(getSharpToFlat(note));
    else midi_root = getMidiValue(note);

    thirds.push(midi_root);

    let midi_third: number;
    let midi_fifth: number;
    let midi_seventh: number;

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

export function getNotationElements(notation: string): NotationElements {

    let aux_str: string[];
    let octave: string;

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

    let type: string;
    let accidental: string;
    let seventh: boolean;

    if (is_minor == -1) 
        type = "Major"

    else if (is_diminished != -1) 
        type = "Diminished"
    
    else 
        type = "Minor"

    if (has_flat != -1) accidental = name[has_flat];
    else if (has_sharp != -1) accidental = name[has_sharp];
    else accidental = '';

    if (has_seventh != -1) seventh = true;
    else seventh = false;

    const chord_elements: NotationElements = {

        name: name,
        root: root,
        has_seventh: seventh,
        type: type,
        accidental: accidental,
        octave: +octave
    };
    return chord_elements;
}