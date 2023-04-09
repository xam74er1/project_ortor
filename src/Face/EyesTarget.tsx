import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export class Target {
    private _left?: any;
    private _right?: any;
    private _center?: any;
    private _listCallBack: (() => void)[] = [];
    setIsRedy?: React.Dispatch<React.SetStateAction<boolean>>


    exportToJSON(){
        return{
            left:this._left.current.position,
            right:this._right.current.position,
            center:this._center.current.position
        }
    }

    editFromJSON(json) {
        this._left.current.position.set(json.left.x,json.left.y,json.left.z)
        this._right.current.position.set(json.right.x,json.right.y,json.right.z)
        this._center.current.position.set(json.center.x,json.center.y,json.center.z)
    }

    public get left(): any {
        return this._left;
    }

    public set left(value: any) {
        this._left = value;
    }

    public get right(): any {
        return this._right;
    }

    public set right(value: any) {
        this._right = value;
    }

    public get center(): any {
        return this._center;
    }

    public set center(value: any) {
        this._center = value;
        this.updateCallbacks();
    }

    public get listCallBack(): (() => void)[] {
        return this._listCallBack;
    }

    public updateCallbacks(): void {
        console.log("updqte cqll bqck list ",this.listCallBack)
        this.listCallBack.forEach((callback) => callback());
    }
}


export function EyesTarget(props) {
    const { centerVisible, leftVisible, rightVisible,target } = props;

    const centerRef = useRef();
    const leftRef = useRef();
    const rightRef = useRef();

    target.center = centerRef;
    target.left = leftRef;
    target.right = rightRef;
    console.log("target in the eyes",target)
    console.log("---")
    target.setIsRedy(true)

    const targetSize = 0.05

    useFrame(() => {
        // You can add animation logic here
    });

    return (
        <>
            {/* Center sphere */}
            <mesh ref={centerRef} position={[0, 0.3, 1.5]} visible={centerVisible}>
                <sphereGeometry args={[targetSize]} />
                <meshBasicMaterial color={0xff0000} />


            {/* Left sphere */}
            <mesh ref={leftRef} position={[0.1, 0, 0]} visible={leftVisible}>
                <sphereGeometry args={[targetSize]} />
                <meshBasicMaterial color={0x00ff00} />
            </mesh>

            {/* Right sphere */}
            <mesh ref={rightRef} position={[-0.1, 0, 0]} visible={rightVisible}>
                <sphereGeometry args={[targetSize]} />
                <meshBasicMaterial color={0x0000ff} />
            </mesh>
            </mesh>
        </>
    );
}
