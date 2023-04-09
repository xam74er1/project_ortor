import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import {Accordion, Alert, Button} from "flowbite-react";
import {singletonUpdater, Slider} from '../Slider';
import {Face} from "../../Face/Model";
import Autocomplete from "../DropDown";
import "./faceTab.css"


interface FaceTabProps {
    face: Face;
}

function FaceTab(props: FaceTabProps) {

    const [all, setAll] = useState<{ [key: string]: any[] }>({ eye: [], brow: [], mouth: [], other: [] });
    const [inputValue, setInputValue] = useState('');
    const [option, setOption] = useState([]);
    const [facePos, setFacePos] = useState({});
    const [faceSlider, setFaceSlider] = useState([]);
    const [buttonText, setButtonText] = useState("add");


    useEffect(() => {
        generateFace()
        let face_pos_local = localStorage.getItem("register_face")
        if(face_pos_local != null ){
            let face_pos = JSON.parse(face_pos_local)
            //We use a for loop to populate the dict , if we not use this metode he will not be refresh on the render
            for (let facePosKey in face_pos) {
                let value = face_pos[facePosKey]
                facePos[facePosKey] = value
                option.push(facePosKey)
            }

        }else{
            //Fist ini
            option.push("default")
        }
        facePos["default"] = [0.12167, 0, 0, 0.0232200008, 0.0232100002, 0, 0, 0.321360022, 0.320379972, 0, 0.13493, 0.0295199994, 0, 0.0623500012, 0.0623000003, 0.0600899979, 0.0600899979, 0, 0, 0.0721099973, 0.0649299994, 0.0667899996, 0.0943700001, 0.085059993, 0.137099996, 0.0986400023, 0.0415199995, 0, 0.0725999996, 0.156719998, 0.0224699993, 0, 0.0868400037, 0.351749986, 0.30388999, 0.23266001, 0.150550008, 0, 0, 0.122029997, 0.119680002, 0.117030002, 0.112520002, 0.0436499976, 0.0455299988, 0.0908899978, 0.0918700024, 0.111319996, 0.112259999, 0.182520002, 0.159529999, 0.000140000004]

        console.log(option,facePos)

    }, []);

    function generateFace() {
        console.log("generate face")
        let newAll = { eye: [], brow: [], mouth: [], other: [] };
        for (let [k, v] of Object.entries(props.face.morphTargetDictionary)) {
            let to_add: unknown = newAll["other"]
            for (let [name, array] of Object.entries(newAll)) {
                //if include the dict nqme like "eye"
                if (k.includes(name)) {
                    to_add = array
                }
            }
            // @ts-ignore
            to_add.push(
                <Slider defaultValue={1} min={-1} max={1.5}
                        step={0.01} title={k}
                        obj={props.face.morphTargetInfluences} mkey={v + ""}
                        maxSpeed={0.5} key={k} />
            )
        }
        setAll(newAll);
        return newAll
    }

    function updateFaceSlider(sliderTab=all) {
        let out = [];
        for (let [name, array] of Object.entries(sliderTab)) {

            out.push(
                <Accordion alwaysOpen={true} className="m-0 p-0" key={name}>
                    <Accordion.Panel className="m-0 p-0">
                        <Accordion.Title className="m-0 p-0 px-0 py-0" style={{margin: "0", padding: "0"}}>
                            {name}
                        </Accordion.Title>
                        <Accordion.Content>
                            {array}
                        </Accordion.Content>
                    </Accordion.Panel>
                </Accordion>
            )
        }
        setFaceSlider(out)
    }

    if(all.eye.length>0 && faceSlider.length==0){
        updateFaceSlider()
    }

    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (showAlert) {
            const timeoutId = setTimeout(() => {
                setShowAlert(false);
            }, 5000);
            return () => clearTimeout(timeoutId);
        }
    }, [showAlert]);


//On change

    function handleDropdownChange(selectedValue) {
        setInputValue(selectedValue)
        for (let i = 0; i < props.face.morphTargetInfluences.length ; i++) {
            props.face.morphTargetInfluences[i] = facePos[selectedValue][i]
        }
        setButtonText("Edit")
        singletonUpdater.updateAll()

    }

    function onTextChange(new_text){
        setInputValue(new_text)
        if(option.includes(new_text)){
            setButtonText("Edit")
        }else{
            setButtonText("Add")
        }
    }

    function addFacePosition(){
        if(!option.includes(inputValue)){
            option.push(inputValue)
        }
        setShowAlert(true)
        console.log(facePos,inputValue)
        facePos[inputValue] = []
        for (let i = 0; i <props.face.morphTargetInfluences.length ; i++) {
            facePos[inputValue].push(props.face.morphTargetInfluences[i])
        }
        saveLocalStorage("register_face",facePos)
    }

    //Save in local storage

    function saveLocalStorage(key,value){
        localStorage.setItem(key, JSON.stringify(value));
    }

    return (
        <div>
            {showAlert && (
                <div className="alert">
                    <div className="flex">
                        <div className="icon">
                            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path
                                    d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                            </svg>
                        </div>
                        <div className="text">
                            <p className="title">you cand find this face postiion in the list at {inputValue} </p>
                        </div>
                    </div>
                </div>

            )}

            <div className={"flex items-start pb-2"}>
                <Autocomplete options={option} onSelect={handleDropdownChange} className={"w-3/4 mr-1"} onChange={onTextChange} onValidate={addFacePosition} />
                <button type="button" className={"validate-button w-1/4"} onClick={addFacePosition}>
                    {buttonText}
                </button>

            </div>


            <Accordion alwaysOpen={true} className="m-0 p-0" key={"opacity"}>
                <Accordion.Panel className="m-0 p-0">
                    <Accordion.Title className="m-0 p-0 px-0 py-0" style={{ margin: "0", padding: "0" }}>
                        Opacity
                    </Accordion.Title>
                    <Accordion.Content>

                        <Slider defaultValue={0.5} min={0} max={1}
                                step={0.01} title={"opacity"}
                                obj={props.face.headGroupRef.current.children[0].children[0].children[0].children[0]} mkey={"material.opacity"}
                                maxSpeed={0.75} />

                    </Accordion.Content>
                </Accordion.Panel>
            </Accordion>

            {faceSlider}
        </div>
    )
}

export default FaceTab;
