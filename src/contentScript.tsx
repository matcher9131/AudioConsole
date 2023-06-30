import type { MessageType } from "./messageType";
import { eqFrequencies } from "./constant";

function getVolume(panValue: number, volumeDb: number): number {
    return (1 - Math.abs(panValue * 0.3)) * 10 ** (volumeDb / 20);
}

const mediaElements = [...document.querySelectorAll("video"), ...document.querySelectorAll("audio")] as readonly HTMLMediaElement[];
let panValue = 0;
const eqGains = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let volumeDb = 0;
const audioContext = new AudioContext();
const biquadFilterNodes = new Array(eqGains.length).fill(0).map((_, i) => {
    const filter = audioContext.createBiquadFilter();
    filter.type = "peaking";
    filter.frequency.setValueAtTime(eqFrequencies[i], audioContext.currentTime);
    filter.gain.setValueAtTime(eqGains[i], audioContext.currentTime);
    return filter;
});
const pannerNode = audioContext.createStereoPanner();
const gainNode = audioContext.createGain();
const audioSources = mediaElements.map(element => audioContext.createMediaElementSource(element));
// AudioSource -> BiquadFilterNodes -> PannerNode -> GainNode -> Destination
for (const source of audioSources) {
    source.connect(biquadFilterNodes[0]);
}
for (let i = 0; i < biquadFilterNodes.length - 1; ++i) {
    biquadFilterNodes[i].connect(biquadFilterNodes[i + 1]);
}
biquadFilterNodes[biquadFilterNodes.length - 1].connect(pannerNode);
pannerNode.connect(gainNode);
gainNode.connect(audioContext.destination);

chrome.runtime.onMessage.addListener((message: MessageType, _sender, sendResponse) => {
    switch (message.type) {
        case "setPanValue": {
            panValue = message.value;
            pannerNode.pan.setValueAtTime(panValue, audioContext.currentTime);
            gainNode.gain.setValueAtTime(getVolume(panValue, volumeDb), audioContext.currentTime);
        } break;
        case "getPanValue": {
            sendResponse(panValue);
        } break;
        case "setEqGains": {
            for (const [index, value] of Object.entries(message.payload)) {
                const i = parseInt(index);
                eqGains[i] = value;
                biquadFilterNodes[i].gain.setValueAtTime(value, audioContext.currentTime);
            }
        } break;
        case "getEqGains": {
            sendResponse(eqGains);
        } break;
        case "getVolume": {
            sendResponse(volumeDb);
        } break;
        case "setVolume": {
            volumeDb = message.value;
            gainNode.gain.setValueAtTime(getVolume(panValue, volumeDb), audioContext.currentTime);
        } break;
        default: {
            const _exhaustiveCheck: never = message;
        } break;
    }
});
