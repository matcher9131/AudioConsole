import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { eqFrequencies } from "./constant";
import type { SetEqGainsMessage } from "./messageType";

const Container = styled.ul`
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    text-align: center;
`;

const ItemContainer = styled.li`
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Slider = styled.input.attrs({ type: "range" })`
    -webkit-appearance: slider-vertical;
    width: 25px;
`;

function frequencyToString(frequency: number) {
    return frequency % 1000 === 0 ? `${frequency / 1000}k` : frequency.toFixed(0);
}


function sendSetEqGainsMessage(index: number, value: number) {
    chrome.tabs.query(
        { active: true, currentWindow: true },
        tabs => {
            chrome.tabs.sendMessage<SetEqGainsMessage, never>(
                tabs[0].id!,
                {
                    type: "setEqGains",
                    payload: {
                        [index]: value
                    }
                }
            );
        }
    );
}

type Props = {
    readonly index: number;
    readonly initialGain: number;
};
const EqualizerSliderControl = ({ index, initialGain }: Props) => {
    const [eqGain, setEqGain] = useState(0);

    // 'eqGain' is initialized by 'initialGain'.
    // 'initialGain' is also updated by selecting the preset.
    useEffect(() => {
        setEqGain(initialGain);
    }, [initialGain]);

    const onEqSliderChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setEqGain(value);
        sendSetEqGainsMessage(index, value);
    };

    const onResetButtonClicked = () => {
        setEqGain(0);
        sendSetEqGainsMessage(index, 0);
    };

    return (
        <Container>
            <ItemContainer>
                {frequencyToString(eqFrequencies[index])}
            </ItemContainer>
            <ItemContainer>
                <Slider
                    value={eqGain}
                    min={-12}
                    max={12}
                    step={0.1}
                    onChange={onEqSliderChanged}
                />
            </ItemContainer>
            <ItemContainer>
                <span>{eqGain.toFixed(1)}</span>
            </ItemContainer>
            <ItemContainer>
                <button onClick={onResetButtonClicked}>0</button>
            </ItemContainer>
        </Container>
    );
};

export default EqualizerSliderControl;
