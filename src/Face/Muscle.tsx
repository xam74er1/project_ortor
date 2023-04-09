import * as THREE from 'three';
import React, {createRef, useEffect, useLayoutEffect, useRef, useState} from 'react';
import { Vector3 ,useFrame} from '@react-three/fiber';
import {QuadraticBezierLine} from "@react-three/drei";

export function Muscle({ start, end,vectorEnd = new THREE.Vector3(0,0,0),radiusStart = 0.2,radiusEnd = 0.2, v1 = new THREE.Vector3(), v2 = new THREE.Vector3() }) {
    const [allAtachMesh, setallAtachMesh] = React.useState([]);
    const nbMuscle = 5
    var oneS = true
    const [value, setValue] = React.useState(new THREE.Vector3());
    const [color, setColor] = React.useState("#ff2060")

    function iniMuscle(){

        let toReturn = []
        for (let i = 0; i < nbMuscle; i++) {
            let tmpRef = createRef()
            toReturn.push(
                // @ts-ignore
                <QuadraticBezierLine ref={tmpRef} lineWidth={5} color={color}  end={undefined} start={undefined}/>
            )
        }
        setallAtachMesh(toReturn)
    }

    useFrame(() => {
        // update the position of the ref based on the start and end positions
        if(allAtachMesh.length==nbMuscle && !end.current.getWorldPosition(v2).equals(value)) {

            for (let i = 0; i < nbMuscle; i++) {


                start.current.getWorldPosition(v1)
                end.current.getWorldPosition(v2)
                v1.add(new THREE.Vector3(0, radiusStart, 0))
                let ref = allAtachMesh[i].ref
                if (ref != null) {
                    //if(isActive(value.clone(),v2.clone(),vectorEnd.clone(),i==0)){
                    if(isActive2(value.clone(),v2.clone(),start.current.position,i==0)){
                        ref.current.material.color.g = 1
                    }else{
                        ref.current.material.color.g = 0
                    }

                    let tmp = vectorEnd.clone().multiplyScalar((i-(nbMuscle/2))*0.01)
                    tmp.applyAxisAngle(new THREE.Vector3(1,0,0),Math.PI/2)

                    v2.add(tmp)

                    v2.add(new THREE.Vector3(0, radiusEnd, 0))

                    let mid = v1.clone()

                    //set to center
                    mid.add(v2)
                    mid.multiplyScalar(0.5)

                    mid.add(vectorEnd.clone().multiplyScalar(radiusEnd * 1.5))

                    // @ts-ignore
                    ref.current.setPoints(
                        v1, v2, mid
                    )


                }


            }
            setValue(end.current.getWorldPosition(v2))
        }
        // console.log( end.current.getWorldPosition(v2),v2)

        oneS = false
    });

    //If the muslce is activated when he move

    function isActive2(originalPos, newPos, start,print=false) {

        let deltaNP = new THREE.Vector3().subVectors( newPos,start);
        let deltaOP = new THREE.Vector3().subVectors( originalPos,start);
        let diff =   deltaOP.length() - deltaNP.length()
        return diff > 0.001
    }

    useLayoutEffect(() => {
        iniMuscle()
    }, []);

    if(start.current === undefined || end.current === undefined){
        return <></>
    }
    return <>
        {allAtachMesh}
    </>
}
