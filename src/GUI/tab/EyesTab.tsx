import React from 'react';
import { Accordion } from 'flowbite-react';
import {Slider} from '../Slider';
import {Face} from "../../Face/Model";
import {EyesObject} from "../../Face/Eyes";
import {generateSlider} from "../Board";

interface Props {
    face: Face;
}

function generateEyesTab(face: Face) {
    const sliders = [
        { key: 'maxAngleLeft', title: 'Left' },
        { key: 'maxAngleRight', title: 'Right' },
        { key: 'maxAngleTop', title: 'Up' },
        { key: 'maxAngleDown', title: 'Down' },
    ];
    let eyeTabs = []
    let eyes : EyesObject;
    for(eyes of [face.eyesLeft,face.eyesRigth]){
        let slidersComponents = sliders.map((sliderProps) => (
            <Slider
                key={sliderProps.key}
                defaultValue={eyes[sliderProps.key]}
                min={0}
                max={90}
                step={0.1}
                title={sliderProps.title}
                obj={eyes}
                mkey={sliderProps.key}
                maxSpeed={5}
            />
        ));

        eyeTabs.push(
            <Accordion alwaysOpen={true} className="m-0 p-0">
                <Accordion.Panel className="m-0 p-0">
                    <Accordion.Title className="m-0 p-0 px-0 py-0" style={{ margin: '0', padding: '0' }}>
                        Maximum angle for eyes {eyes.name}
                    </Accordion.Title>
                    <Accordion.Content>{slidersComponents}</Accordion.Content>
                </Accordion.Panel>
            </Accordion>
        );
    };

    return <>{eyeTabs}</>;
}

function EyesTab(props: Props) {
    const { face } = props;

    return (
        <div>
            {generateEyesTab(face)}
            {generateSlider("Eyes Left postion","eyesRef",face.eyesLeft,false,0.01)}
            {generateSlider("Eyes Rigth postion","eyesRef",face.eyesRigth,false,0.01)}
        </div>
    )
}

export default EyesTab;
