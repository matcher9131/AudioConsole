import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { eqFrequencies, eqPresets, getEqPresetByKey } from "./constant";
import EqualizerSliderControl from "./equalizerSliderControl";
import type { GetEqGainsMessage, SetEqGainsMessage } from "./messageType";

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ResetButton = styled.button`
    width: 50px;
`;

const SlidersContainer = styled.ul`
    list-style: none;
    padding: 0;
    display: flex;
    justify-content: space-between;
`;

const SliderContainer = styled.li`
    list-style: none;
`;

const EqualizerControl = () => {
    const [initialGains, setInitialGains] = useState(eqFrequencies.map(_ => 0));
    const [selectedPreset, setSelectedPreset] = useState("");

    // Initialize all the EqualizerSliderControls.
    // EqualizerSliderControl should be initialized by this component
    // because 'initialGain' of props should be equal to the actual gain.
    useEffect(() => {
        chrome.tabs.query(
            { active: true, currentWindow: true },
            tabs => {
                chrome.tabs.sendMessage<GetEqGainsMessage, readonly number[]>(
                    tabs[0].id!,
                    {
                        type: "getEqGains"
                    },
                    (eqGains: readonly number[]) => {
                        setInitialGains([...eqGains]);
                    }
                );
            }
        );
    }, []);

    const onPresetChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const key = e.target.value;
        setSelectedPreset(key);
        const preset = getEqPresetByKey(key);
        if (preset === undefined) return;
        setInitialGains([...preset.value]);
        chrome.tabs.query(
            { active: true, currentWindow: true },
            tabs => {
                chrome.tabs.sendMessage<SetEqGainsMessage, never>(
                    tabs[0].id!,
                    {
                        type: "setEqGains",
                        payload: Object.fromEntries(preset.value.map((value, index) => [index, value]))
                    }
                );
            }
        );
    };

    const onResetButtonClicked = () => {
        const gains = eqFrequencies.map(_ => 0);
        setSelectedPreset("");
        setInitialGains([...gains]);
        chrome.tabs.query(
            { active: true, currentWindow: true },
            tabs => {
                chrome.tabs.sendMessage<SetEqGainsMessage, never>(
                    tabs[0].id!,
                    {
                        type: "setEqGains",
                        payload: Object.fromEntries(gains.map((value, index) => [index, value]))
                    }
                );
            }
        );
    }

    return (
        <fieldset>
            <legend>Graphic Eq</legend>
            <HeaderContainer>
                <div>
                    <span>プリセット：</span>
                    <select
                        value={selectedPreset}
                        onChange={onPresetChanged}
                    >
                        <option value="">▼選択</option>
                        {eqPresets.map(({ key, display }) => (
                            <option value={key} key={key}>{display}</option>
                        ))}
                    </select>
                </div>
                <ResetButton onClick={onResetButtonClicked}>Reset</ResetButton>
            </HeaderContainer>
            <SlidersContainer>
                {eqFrequencies.map((frequency, index) => (
                    <SliderContainer key={frequency}>
                        <EqualizerSliderControl index={index} initialGain={initialGains[index]} />
                    </SliderContainer>
                ))}
            </SlidersContainer>
        </fieldset>
    );
};

export default EqualizerControl;
