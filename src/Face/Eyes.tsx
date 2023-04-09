import * as THREE from 'three';
import React, {createRef, useEffect, useLayoutEffect, useRef, useState} from 'react';
import { Vector3 ,useFrame} from '@react-three/fiber';
import {Muscle} from "./Muscle";




export class EyesObject {
    private eyesRef: React.RefObject<HTMLElement> = React.createRef();
    private irisRightRef: React.RefObject<HTMLElement> = React.createRef();
    private puipilleRightRef: React.RefObject<HTMLElement> = React.createRef();
    private target: React.RefObject<HTMLElement> = React.createRef();
    private position: THREE.Vector3 = new THREE.Vector3();
    private _name : string =""


    private _maxAngleLeft = 30; // maximum angle eyes can move to the left
    private _maxAngleRight = 30; // maximum angle eyes can move to the right
    private _maxAngleTop = 15; // maximum angle eyes can move upward
    private _maxAngleDown = 15; // maximum angle eyes can move downward


    constructor(name: string = "") {
        this._name = name;
    }

    exportToJSON(){

        return{
            maxAngleLeft:this._maxAngleLeft,
            maxAngleRight:this._maxAngleRight,
            maxAngleTop:this._maxAngleTop,
            maxAngleDown:this._maxAngleDown,
            position:{
                x:this.position.x,
                y:this.position.y,
                z:this.position.z
            }

        }

    }

    editFromJSON(json) {
        console.log(json)
        this._maxAngleLeft = json.maxAngleLeft;
        this._maxAngleRight = json.maxAngleRight;
        this._maxAngleTop = json.maxAngleTop;
        this._maxAngleDown = json.maxAngleDown;
        this.position.set(json.position.x,json.position.y,json.position.z)

    }


    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    public getEyesRef(): React.RefObject<HTMLElement> {
        return this.eyesRef;
    }

    public setEyesRef(ref: React.RefObject<HTMLElement>): void {
        this.eyesRef = ref;
    }

    public getIrisRightRef(): React.RefObject<HTMLElement> {
        return this.irisRightRef;
    }

    public setIrisRightRef(ref: React.RefObject<HTMLElement>): void {
        this.irisRightRef = ref;
    }

    public getPuipilleRightRef(): React.RefObject<HTMLElement> {
        return this.puipilleRightRef;
    }

    public setPuipilleRightRef(ref: React.RefObject<HTMLElement>): void {
        this.puipilleRightRef = ref;
    }

    public getTarget(): React.RefObject<HTMLElement> {
        return this.target;
    }

    public setTarget(ref: React.RefObject<HTMLElement>): void {
        this.target = ref;
    }

    public getPosition(): Vector3 {
        return this.position;
    }

    public setPosition(position: THREE.Vector3): void {
        this.position = position;
    }


    get maxAngleLeft(): number {
        return this._maxAngleLeft;
    }

    set maxAngleLeft(value: number) {
        this._maxAngleLeft = value;
    }

    get maxAngleRight(): number {
        return this._maxAngleRight;
    }

    set maxAngleRight(value: number) {
        this._maxAngleRight = value;
    }

    get maxAngleTop(): number {
        return this._maxAngleTop;
    }

    set maxAngleTop(value: number) {
        this._maxAngleTop = value;
    }

    get maxAngleDown(): number {
        return this._maxAngleDown;
    }

    set maxAngleDown(value: number) {
        this._maxAngleDown = value;
    }
}


export function Eyes(props) {
    const eyesRef = useRef();
    const irisRightRef = useRef();
    const puipilleRightRef = useRef();

    //Muscle

    const start = useRef();
    const [allAtachMesh, setallAtachMesh] = React.useState([]);
    const attach1 = useRef();

    const eysObj : EyesObject = props.obj

    const [value, setValue] = React.useState(new THREE.Vector3());

    const radius = 0.2
//Use to set the muscle end pos
    const allPos =[[0,1,0],[0,-1,0],[1,0,0],[-1,0,0]]

    eysObj.setPuipilleRightRef(puipilleRightRef)
    eysObj.setEyesRef(eyesRef)
    eysObj.setIrisRightRef(irisRightRef)
    eysObj.setTarget(props.eyesTarget)

    function iniAtach(){


        let temp = []
        for (let p = 0; p < allPos.length; p++) {

            let unitVector = new THREE.Vector3(allPos[p][0],allPos[p][1],allPos[p][2])
            let npos = unitVector.multiplyScalar(radius)

            // @ts-ignore
            let tmpRef = createRef(null)

            temp.push(
                <mesh
                    geometry={new THREE.SphereGeometry(0.05)}
                    material={new THREE.MeshBasicMaterial({ color: 0x00ff00 })}
                    position={npos}
                    visible={false}
                    // @ts-ignore
                    ref={tmpRef}
                />
            )

        }
        setallAtachMesh(temp)
        console.log("ini atach",allAtachMesh)
    }

    useLayoutEffect(() => {
        iniAtach()
    }, []);


    function iniMuscle(allAtachMesh){
        let toReturn =[]
        for (let i = 0; i <allAtachMesh.length ; i++) {
            let unitVector = new THREE.Vector3(allPos[i][0],allPos[i][1],allPos[i][2])
            toReturn.push(  <Muscle start={start} end={allAtachMesh[i].ref} vectorEnd={unitVector}></Muscle>)
        }
        return toReturn
    }



    useFrame(() => {
        // You can add animation logic here
        let eysPos = new THREE.Vector3();

        props.eyesTarget.getWorldPosition(eysPos);
        if(eyesRef.current != undefined && !value.equals(eysPos)){

            // @ts-ignore
            eyesRef.current.lookAt(eysPos)

            // @ts-ignore
            const degreesX = THREE.MathUtils.radToDeg(eyesRef.current.rotation.x);
            // @ts-ignore
            const degreesY = THREE.MathUtils.radToDeg(eyesRef.current!.rotation.y);

            if (degreesY > eysObj.maxAngleLeft) {
                // @ts-ignore
                eyesRef.current.rotation.y = THREE.MathUtils.degToRad(eysObj.maxAngleLeft);
            } else if (degreesY < -eysObj.maxAngleRight) {
                // @ts-ignore
                eyesRef.current.rotation.y = THREE.MathUtils.degToRad(-eysObj.maxAngleRight);
            }

            if (degreesX > eysObj.maxAngleTop) {
                // @ts-ignore
                eyesRef.current.rotation.x = THREE.MathUtils.degToRad(eysObj.maxAngleTop);
            } else if (degreesX < -eysObj.maxAngleDown) {
                // @ts-ignore
                eyesRef.current.rotation.x = THREE.MathUtils.degToRad(-eysObj.maxAngleDown);
            }

            setValue(eysPos)

        }



    });

    // @ts-ignore
    return (
        <>


            <mesh
                ref={start}
                geometry={new THREE.SphereGeometry(radius/2)}
                material={new THREE.MeshBasicMaterial({ color: 0x00ff00 })}
                position={[0,0.3,-0.3]}
            />


            <group ref={eyesRef} position={eysObj.getPosition()}>



                <mesh geometry={new THREE.SphereGeometry(radius)}
                      material={new THREE.MeshBasicMaterial({ color: 0xffffff })}>

                    {allAtachMesh}

                    <mesh ref={irisRightRef}
                          geometry={new THREE.SphereGeometry(0.1,100,100)}
                          material={new THREE.MeshBasicMaterial({ color: 0x484f52 })}
                          position={[0,0,0.11]}>

                        <mesh ref={puipilleRightRef}
                              geometry={new THREE.SphereGeometry(0.04,100,100)}
                              material={new THREE.MeshBasicMaterial({ color: 0x317487})}
                              position={[0,0,0.07]} />

                    </mesh>
                </mesh>
            </group>

            { iniMuscle(allAtachMesh)}

        </>
    );
}
