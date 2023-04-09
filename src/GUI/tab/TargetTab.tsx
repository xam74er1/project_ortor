import {Face} from "../../Face/Model";
import {generateSlider} from "../Board";

interface FaceTabProps {
    face: Face;
    target:any
}



function TargetTab(props: FaceTabProps) {
    const {face,target}= props
    return(
        <div>
            {generateSlider("target center","_center",target)}
            {generateSlider("target left","_left",target,false)}
            {generateSlider("target rigth","_right",target,false)}
        </div>
    )


}
export default TargetTab
