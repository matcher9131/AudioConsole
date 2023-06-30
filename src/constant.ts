export const eqFrequencies = [31.25, 62.5, 125, 250, 500, 1000, 2000, 4000, 8000, 16000] as const;

export const eqPresets = [
    {
        key: "low",
        display: "低音",
        value: [10, 9, 8, 3.2, 0, -3.2, -5, -6.7, -8, -8]
    },
    {
        key: "high",
        display: "高音",
        value: [-8, -8, -8, -4.5, 0, 3.2, 9, 9, 9, 9]
    },
    {
        key: "eargasm",
        display: "Eargasm Explosion",
        value: [-3, 0, 3, 1, 0, -1, 1, -2, 5, 2]
    },
    {
        key: "vocal",
        display: "ボーカル",
        value: [0, -4, -5, -3, 5, 4, 0, -1, 0, 1]
    }
] as const;

export function getEqPresetByKey(key: string) {
    return eqPresets.find(preset => preset.key === key);
}
