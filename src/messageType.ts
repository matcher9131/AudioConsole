export type GetPanValueMessage = {
    readonly type: "getPanValue";
};

export type SetPanValueMessage = {
    readonly type: "setPanValue";
    readonly value: number;
};

export type GetEqGainsMessage = {
    readonly type: "getEqGains";
}

export type SetEqGainsMessage = {
    readonly type: "setEqGains";
    readonly payload: { readonly [index: string]: number };
};

export type GetVolumeMessage = {
    readonly type: "getVolume";
};

export type SetVolumeMessage = {
    readonly type: "setVolume";
    readonly value: number;
}

export type MessageType = GetPanValueMessage
    | SetPanValueMessage
    | GetEqGainsMessage
    | SetEqGainsMessage
    | GetVolumeMessage
    | SetVolumeMessage;
