/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 .\\public\\facecap.glb --transform -T
*/

import React, {useEffect, useLayoutEffect, useRef, useState} from 'react'
// @ts-ignore
import * as THREE from 'three';
import { KTX2Loader } from '../lib/KTX2Loader.js';
import { MeshoptDecoder } from '../lib/meshopt_decoder.module.js';
import { GLTFLoader } from '../lib/GLTFLoader.js';
import {Material, Vector3} from "three";
import {Eyes, EyesObject} from './Eyes';
import {EyesTarget} from "./EyesTarget";

export class Face{
    private _eyesLeft : EyesObject
    private _eyesRigth : EyesObject
    private _visible = true
    private _head_mesh = undefined
    private _headGroupRef
    private _morphTargetDictionary
    private _morphTargetInfluences
    private _target


    constructor() {
        this._eyesLeft = new EyesObject("left")
        this._eyesRigth = new EyesObject("rigth")

        this._eyesLeft.setPosition(new Vector3(0.35,0.25,0.2))
        this._eyesRigth.setPosition(new Vector3(-0.33, 0.27, 0.2))

    }

    exportToJSON(){
        return {
            morphTargetInfluences: this._morphTargetInfluences,
            eyeRigth : this._eyesRigth.exportToJSON(),
            eyeLeft : this._eyesLeft.exportToJSON(),
            target:this._target.exportToJSON()
        }
    }

    editFromJSON(json) {

        for (let i = 0; i < this._morphTargetInfluences.length ; i++) {
            this._morphTargetInfluences[i] = json.morphTargetInfluences[i]
        }
        console.log(json)
        this._eyesLeft.editFromJSON(json.eyeLeft);
        this._eyesRigth.editFromJSON(json.eyeRigth);
        this._target.editFromJSON(json.target);
    }

    get eyesLeft(): EyesObject {
        return this._eyesLeft;
    }

    set eyesLeft(value: EyesObject) {
        this._eyesLeft = value;
    }

    get eyesRigth(): EyesObject {
        return this._eyesRigth;
    }

    set eyesRigth(value: EyesObject) {
        this._eyesRigth = value;
    }

    get visible(): boolean {
        return this._visible;
    }

    set visible(value: boolean) {
        this._visible = value;
    }

    get head_mesh(): any {
        return this._head_mesh;
    }

    set head_mesh(value: any) {
        this._head_mesh = value;
    }

    get headGroupRef() {
        return this._headGroupRef;
    }

    set headGroupRef(value) {
        this._headGroupRef = value;
    }


    get morphTargetDictionary() {
        return this._morphTargetDictionary;
    }

    set morphTargetDictionary(value) {
        this._morphTargetDictionary = value;
    }

    get morphTargetInfluences() {
        return this._morphTargetInfluences;
    }

    set morphTargetInfluences(value) {
        this._morphTargetInfluences = value;
    }

    get target() {
        return this._target;
    }

    set target(value) {
        this._target = value;
    }
}


// @ts-ignore
export function Model(props) {
    const group = useRef()
    const faceRef = useRef()
    const {target,face} = props
    const [eyesVisible, setEysVisible] = useState(false);

    var materials : Material

    // @ts-ignore
//  const { nodes, materials, animations } = useGLTF('/facecap-transformed.glb')
    const [nodes,setNode] = useState({
        mesh_0: undefined,
        mesh_1: undefined,
        mesh_2: undefined,
        mesh_3: undefined
    })

    const [isLoad, setisLoad] = useState(false);

    function loadGLTFModel(){
        var renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );

        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.outputEncoding = THREE.sRGBEncoding;


        var ktx2Loader = new KTX2Loader()
            .setTranscoderPath( 'basis/' )
            .detectSupport( renderer );

        console.log("before")

        new GLTFLoader()
            // @ts-ignore
            .setKTX2Loader( ktx2Loader )
            .setMeshoptDecoder( MeshoptDecoder )
            .load( 'facecap.glb', ( gltf: any ) => {
                console.log("In the gltf",gltf)

                let tmp_node = {}
                for (let i = 0; i <4 ; i++) {
                    let key = 'mesh_'+i
                    console.log(key,gltf.scene.children[0].getObjectByName(key))
                    console.log(nodes)
                    // @ts-ignore
                    tmp_node[key] = gltf.scene.children[0].getObjectByName(key);
                }
                // @ts-ignore
                setNode(tmp_node)
                // @ts-ignore

                setisLoad( true)
            })

        console.log("after")
    }

    useEffect(() => {
        console.log("add call back")
        target.listCallBack.push(() => {
            console.log("call back A call",target)
            if(target.left?.current != undefined && target.right?.current != undefined){

                setEysVisible(true)
            }
        });
    }, []);


    useLayoutEffect(() => {
        loadGLTFModel()
    }, []);



    if(! isLoad){
        console.log("not load")
        return (
            <sphereGeometry />
        )
    }else{

        console.log("load")
        // @ts-ignore
        materials = nodes.mesh_0.material
        face.headGroupRef = faceRef
        face.morphTargetDictionary = nodes.mesh_2.morphTargetDictionary
        face.morphTargetInfluences = nodes.mesh_2.morphTargetInfluences
        nodes.mesh_3.material.opacity = 0.75
        nodes.mesh_3.material.transparent = true
        console.log(face)
        console.log(nodes.mesh_3.material)
    }


    // @ts-ignore
    return (


        <group ref={group} {...props} dispose={null}>
            <group name="Scene">

                { eyesVisible && (
                    <>
                        <Eyes obj={face._eyesRigth} eyesTarget={target.right.current}/>
                        <Eyes obj={face._eyesLeft} eyesTarget={target.left.current} />
                    </>
                )
                }
                <EyesTarget centerVisible={true} leftVisible={true} rightVisible={true} target ={target} />

                <group name="Empty" scale={10} ref={faceRef}>
                    <group
                        name="grp_scale"
                        rotation={[Math.PI / 2, 0, 0]}
                        scale={0.01000001}>
                        <group
                            name="grp_transform"
                            rotation={[-0.02235145, -0.03253672, -0.00800708]}>


                            <group name="head">
                                <mesh
                                    name="mesh_2"

                                    geometry={
                                        // @ts-ignore
                                        nodes.mesh_2.geometry}
                                    material={
                                        // @ts-ignore
                                        nodes.mesh_2.material}
                                    morphTargetDictionary={
                                        // @ts-ignore
                                        nodes.mesh_2.morphTargetDictionary}
                                    morphTargetInfluences={
                                        // @ts-ignore
                                        face.morphTargetInfluences}
                                    position={[-10.9031467, -18.0278683, -18.1311016]}
                                    scale={0.00194938}
                                />
                            </group>
                            <group name="teeth">
                                <mesh
                                    name="mesh_3"

                                    geometry={
                                        // @ts-ignore
                                        nodes.mesh_3.geometry}
                                    material={
                                        // @ts-ignore
                                        nodes.mesh_3.material}
                                    position={[-10.9031467, -18.0278683, -18.1311016]}
                                    scale={0.00194938}
                                />
                            </group>
                        </group>
                    </group>
                </group>
            </group>
        </group>

    )
}


//useGLTF.preload('/facecap-transformed.glb')
