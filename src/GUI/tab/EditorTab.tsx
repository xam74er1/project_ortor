import {generateSlider} from "../Board";
import React, {useEffect, useState} from "react";
import Autocomplete from "../DropDown";
import {Label, TextInput} from "flowbite-react";
import {Face} from "../../Face/Model";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import "./EditorTab.css"
import {singletonUpdater} from "../Slider";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

interface Props {
    face: Face;
}

function EditorTab(props: Props) {
    const [option, setOption] = useState([]);
    const { face } = props;
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [inputValue, setInputValue] = useState('');
    const [name, setName] = useState("");

    const storageName = "faceDict"
    useEffect(() => {

        if(localStorage.getItem(storageName) != null){
            let dataDict = JSON.parse(localStorage.getItem(storageName))
            let data = dataDict[inputValue]
            setOption( Object.keys(dataDict))
        }

    }, []);

    function onEditorStateChange(newEditorState) {
        setEditorState(newEditorState);
    }

    function saveData() {
        console.log(name)
            let key=name

        let htmlval = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        console.log(editorState)
        // Add your save data functionality here
        let data_to_save = {
            name:name,
            desc : htmlval,
            face:face.exportToJSON()
        }

        let dataDict ={}
        if(localStorage.getItem(storageName) != null){
             dataDict = JSON.parse(localStorage.getItem(storageName))
        }

        dataDict[key] = data_to_save
        setOption( Object.keys(dataDict))
        localStorage.setItem(storageName, JSON.stringify(dataDict));

        console.log(dataDict,key,data_to_save)
    }

    function loadData(inputValue) {
        // Add your load data functionality here
        console.log(inputValue)
        let dataDict ={}
        if(localStorage.getItem(storageName) != null){
            dataDict = JSON.parse(localStorage.getItem(storageName))
        }
        let data = dataDict[inputValue]
        if(data != null){
            console.log(data)

            setOption( Object.keys(dataDict))
            face.editFromJSON(data.face)
            setName(data.name)


            if(data.desc){
                let contentBlock = htmlToDraft(data.desc);
                let contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                let loaedEditorState = EditorState.createWithContent(contentState);
                setEditorState(loaedEditorState)
            }else{
                console.log("no state",data)
                setEditorState(EditorState.createEmpty())
            }


            singletonUpdater.updateAll()

        }else{
            console.log("data is null",inputValue,dataDict)
        }


    }

    function handleDropdownChange(name) {
        // Add your dropdown change functionality here
        loadData(name);
    }

    function onTextChange(new_text) {
        // Add your text change functionality here
        setInputValue(new_text)
    }

    function onValidate() {
        loadScenario()
    }

    function loadScenario() {
        loadData(inputValue);
    }

    function save() {
        saveData();
    }

    function nameChange(e) {
        setName(e.target.value);
    }

    return (
        <div>
            <div className={"flex items-start pb-2"}>
                <Autocomplete
                    options={option}
                    onSelect={handleDropdownChange}
                    className={"w-3/4 mr-1"}
                    onChange={onTextChange}
                    onValidate={onValidate}
                />
                <button type="button" className={"validate-button w-1/4"} onClick={() => loadData(inputValue)}>
                    Load
                </button>
            </div>
            <button type="button" className={"validate-button w-full"} onClick={() => saveData()}>
                Save
            </button>
            <form>
                <div>
                    <div className="mb-6">
                        <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Name
                        </label>
                        <input
                            type="text"
                            id="default-input"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={name}
                            onChange={nameChange}
                        />
                    </div>
                </div>


                <div className="mb-6">
                    <label htmlFor="default-input"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Information
                    </label>

                    <Editor
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorContent"
                        onEditorStateChange={onEditorStateChange}
                        editorState={editorState}
                    />

                </div>


            </form>

</div>
)
}

export default EditorTab;
