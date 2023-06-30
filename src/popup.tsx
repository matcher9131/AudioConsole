import React, { Suspense, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import EqualizerControl from "./equalizerControl";
import PanControl from "./panControl";
import VolumeControl from "./volumeControl";

const Container = styled.div`
    width: 350px;
`;

const Popup = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Container>
                <PanControl />
                <EqualizerControl />
                <VolumeControl />
            </Container>
        </Suspense>
    );
};

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);
