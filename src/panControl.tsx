import React, { useEffect, useState } from "react";
import styled from "styled-components";
import type { GetPanValueMessage, SetPanValueMessage } from "./messageType";

const Container = styled.fieldset`
    display: flex;
    justify-content: space-between;
`;

const PanSlider = styled.input.attrs({
    type: "range"
})`
    
`;

const PanButton = styled.button`
    width: 50px;
`;

function sendSetPanValueMessage(value: number) {
    chrome.tabs.query(
        { active: true, currentWindow: true },
        tabs => {
            chrome.tabs.sendMessage<SetPanValueMessage, never>(
                tabs[0].id!,
                {
                    type: "setPanValue",
                    value
                }
            );
        }
    );
}

const PanControl = () => {
    const [panValue, setPanValue] = useState(0);

    useEffect(() => {
        chrome.tabs.query(
            { active: true, currentWindow: true },
            tabs => {
                chrome.tabs.sendMessage<GetPanValueMessage, number>(
                    tabs[0].id!,
                    {
                        type: "getPanValue"
                    },
                    (panValue: number) => {
                        setPanValue(panValue);
                    }
                );
            }
        );
    }, []);

    const onPanSliderChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setPanValue(value);
        sendSetPanValueMessage(value);
    };

    const onPanLeftClicked = () => {
        setPanValue(-1);
        sendSetPanValueMessage(-1);
    };

    const onPanCenterClicked = () => {
        setPanValue(0);
        sendSetPanValueMessage(0);
    };

    const onPanRightClicked = () => {
        setPanValue(1);
        sendSetPanValueMessage(1);
    };

    return (
        <Container>
            <legend>Pan</legend>
            <PanSlider
                value={panValue}
                max={1}
                min={-1}
                step={0.1}
                onChange={onPanSliderChanged}
            />
            <span>{panValue.toFixed(1)}</span>
            <PanButton onClick={onPanLeftClicked}>L</PanButton>
            <PanButton onClick={onPanCenterClicked}>C</PanButton>
            <PanButton onClick={onPanRightClicked}>R</PanButton>
        </Container>
    )
};

export default PanControl;
