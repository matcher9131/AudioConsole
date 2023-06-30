import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { GetVolumeMessage, SetVolumeMessage } from "./messageType";

const Container = styled.fieldset`
    display: flex;
    justify-content: space-between;
`;

const VolumeSlider = styled.input.attrs({
    type: "range"
})`
    
`;

const VolumeButton = styled.button`
    width: 50px;
`;

const InvisibleButton = styled.button`
    width: 50px;
    visibility: collapse;
`;

function sendSetVolumeMessage(value: number) {
    chrome.tabs.query(
        { active: true, currentWindow: true },
        tabs => {
            chrome.tabs.sendMessage<SetVolumeMessage, never>(
                tabs[0].id!,
                {
                    type: "setVolume",
                    value
                }
            );
        }
    );
}

const VolumeControl = () => {
    const [volume, setVolume] = useState(0);

    useEffect(() => {
        chrome.tabs.query(
            { active: true, currentWindow: true },
            tabs => {
                chrome.tabs.sendMessage<GetVolumeMessage, number>(
                    tabs[0].id!,
                    {
                        type: "getVolume"
                    },
                    (volume: number) => {
                        setVolume(volume);
                    }
                );
            }
        );
    }, []);

    const onVolumeSliderChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setVolume(value);
        sendSetVolumeMessage(value);
    };

    const onVolumeResetClicked = () => {
        setVolume(0);
        sendSetVolumeMessage(0);
    };

    return (
        <Container>
            <legend>Volume</legend>
            <VolumeSlider
                value={volume}
                max={12}
                min={-12}
                step={0.1}
                onChange={onVolumeSliderChanged}
            />
            <span>{volume.toFixed(1)}</span>
            <InvisibleButton></InvisibleButton>
            <InvisibleButton></InvisibleButton>
            <VolumeButton onClick={onVolumeResetClicked}>Reset</VolumeButton>
        </Container>
    );
};

export default VolumeControl;
