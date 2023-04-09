
import React, {Suspense, useEffect, useRef, useState} from 'react'
import { Canvas } from '@react-three/fiber'
// @ts-ignore
import { OrbitControls, Stage } from '@react-three/drei'
import {Face, Model} from './Face/Model'
import Board from "./GUI/Board";
import {Target} from "./Face/EyesTarget";


export default function Viewer() {
    const ref = useRef()
    const [visible, setVisible] = useState(false);
    const [loadedTarget, setloadedTarget] = useState(undefined);
    const [target,setTarget] = useState(new Target())
    const [face,setFace] = useState(new Face())

        target.setIsRedy = (e)=>{
            console.log("in the callBack",target,loadedTarget)
            if(loadedTarget?.center?.current==undefined){
                setloadedTarget(target)
            }
            if( ! (loadedTarget?.center?.current==undefined || visible)){
                setVisible(true)
                face.target=target
            }
            target.updateCallbacks()
        }


    useEffect(() => {
        if (target.center !== undefined) {
            console.log("now center is define")
        }
    });


    // @ts-ignore
    return (
        <>

            {
                visible && (
                    <Board target={loadedTarget} face={face}>
                        <h1>This is a draggable board</h1>
                    </Board>
                )
            }

            <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }} style={{ zIndex: 0 }}>
                <Suspense fallback={null}>
                    <Stage  preset="rembrandt" intensity={1}  environment="city">
                        false
                        <Model target = {target} face = {face} />
                        false
                    </Stage>
                </Suspense>
                <OrbitControls  />
            </Canvas>



        </>
    )
}
