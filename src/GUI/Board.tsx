import React, {useEffect, useRef, useState} from 'react';
import Draggable from 'react-draggable';
import {Accordion, Card, Tabs} from "flowbite-react";
import {Slider} from './Slider';
import "./scrollbqr.css"
import {Face} from "../Face/Model";
import {EyesObject} from "../Face/Eyes";
import FaceTab from "./tab/FaceTab";
import EyesTab from "./tab/EyesTab";
import EditorTab from "./tab/EditorTab";
import "./Board.css"
import TargetTab from "./tab/TargetTab";


export function generateSlider(name,key,obj,open=true,step=0.1){
    const sliders = [];
    let pos = key+".current.position"

    for (const axis of ['x', 'y', 'z']) {
        sliders.push(
            <Slider defaultValue={5} min={-5} max={10}
                    step={step} title={name+" "+axis}
                    obj={obj} mkey={pos+"."+axis}
                    maxSpeed={0.5} />
        );
    }
    //flush={true}
    return(
        <div>

            <Accordion  alwaysOpen={true} collapseAll={! open}  className={"m-0 p-0 "}>
                <Accordion.Panel className={"m-0 p-0 "}>
                    <Accordion.Title className={"m-0 p-0 px-0 py-0"} style={{margin:"0",padding:"0"}}>
                        {name}
                    </Accordion.Title>
                    <Accordion.Content>
                        { sliders}
                    </Accordion.Content>
                </Accordion.Panel>
            </Accordion>
        </div>
    )
}

const Board = ({ children,target,face}) => {

    const [visible, setVisible] = useState(true);


    const handleChange = (event) => {
        setVisible(event.currentTarget.checked);
    }

    useEffect(() => {
        // This function will be called after every render of the component
        console.log('Component updated',target.center);
        console.log("target ",target)
    });


    console.log("target ",target)

    // @ts-ignore

    return (
        <Draggable
            handle=".handle"
            defaultPosition={{x: 0, y: 0}}
            position={null}
        >

            <div className={"fullBoard "}>
                <div className={"flex flex-row h-10 bandeau"} style={{background:"gray"}}>
                    <div className="handle grow" style={{cursor: "grab -webkit-grab"}} >


                    </div>

                    <div className="items-center justify-center m-auto">
                        <label className="relative inline-flex items-center cursor-pointer mt-1">
                            <input type="checkbox" checked={visible} onChange={handleChange} className="sr-only peer" />

                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"/>
                        </label>
                    </div>
                </div>

                {
                    visible && (
                        <div >

                            <div className={"mainPan" +
                                "max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow" +
                                "scroll-m-0.5 resize hover:resize scroll-smooth overflow-scroll"}>
                                <div>

                                    <Tabs.Group
                                        aria-label="Tabs with underline"
                                        style="underline"
                                    >

                                        <Tabs.Item title="Editor">
                                            <EditorTab face={face}/>
                                        </Tabs.Item>

                                        <Tabs.Item title="Target">
                                            <TargetTab face={face} target={target}/>
                                        </Tabs.Item>
                                        <Tabs.Item title="Eyes">
                                            <EyesTab face={face} />
                                        </Tabs.Item>

                                        <Tabs.Item title="Face">
                                            <FaceTab face={face} />
                                        </Tabs.Item>

                                    </Tabs.Group>


                                </div>
                            </div>

                        </div>
                    )
                }


            </div>
        </Draggable>
    )
};

export default Board;
