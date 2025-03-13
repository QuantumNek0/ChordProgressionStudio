import { Chord } from "music";
onmessage = async (event) => {
    let pad = event.data;
    pad = Object.setPrototypeOf(pad, Chord.prototype);
    await pad.initAudio();
    self.postMessage(pad);
};
