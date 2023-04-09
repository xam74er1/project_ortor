import React, { useEffect, useRef } from 'react';
import './Slider.css';

class UpdaterSingleton{
    private all_function: Function[];

    constructor() {
        this.all_function = []
    }

    updateAll(){
        for (let i = 0; i < this.all_function.length ; i++) {
            this.all_function[i]()
        }
    }

    add(fct:Function){
        this.all_function.push(fct)
    }

}


const singletonUpdater = Object.freeze(new UpdaterSingleton());


function Slider({
                    title,
                    min = 0,
                    max = 100,
                    step = 1,
                    defaultValue = 50,
                    maxSpeed = 10,
                    obj = undefined,
                    mkey = ''
                }) {
    const [value, setValue] = React.useState(defaultValue);
    const [oldValue, setOldValue] = React.useState(defaultValue);
    const [inputValue, setInputValue] = React.useState(defaultValue);

    const handleChange = (event) => {

        const newValue = Number(event.target.value);
        const diff = Math.abs(newValue - oldValue);
        setOldValue(value)
        if (diff > maxSpeed) {
            // If the difference between the new value and the old value is greater than the max speed,
            // set the value to the old value plus the max speed.
            if (newValue > oldValue) {
                setValue(oldValue + maxSpeed);
            } else {
                setValue(oldValue - maxSpeed);
            }
        } else {
            setValue(newValue);
        }

        set(obj, mkey, value);
    };

    const handleInputChange = (event) => {
        const newValue = Number(event.target.value);
        setInputValue(newValue);
        if (newValue >= min && newValue <= max) {
            setValue(newValue);
            set(obj, mkey, newValue);
        }
    };

    function get(obj, keyPath) {
        const keys = keyPath.split('.');
        let currentObj = obj;

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];

            if (currentObj == undefined) {
                return undefined;
            }
            if (!currentObj.hasOwnProperty(key)) {
                currentObj[key] = {};
            }
            currentObj = currentObj[key];
        }

        return currentObj[keys[keys.length - 1]];
    }

    function set(obj, keyPath, value) {
        const keys = keyPath.split('.');
        let currentObj = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!currentObj.hasOwnProperty(key)) {
                currentObj[key] = {};
            }
            currentObj = currentObj[key];
        }
        currentObj[keys[keys.length - 1]] = value;
    }

    function update(){
        if (obj) {
            let tmp = get(obj, mkey);
            if (tmp != undefined && tmp != oldValue) {
                setOldValue(tmp);
                setValue(tmp);
                setInputValue(tmp);
            }
        }
    }

    useEffect(() => {
        update()
    }, [obj, mkey]);

    useEffect(() => {
        console.log("add to singleton updater")
        singletonUpdater.add(update)
    }, []);


    return (
        <div className="slider-container">
            <div className="slider-title">{title}</div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value.toFixed(3)}
                onChange={handleChange}
                className="slider"
            />
            <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={value.toFixed(3).toString().replace(/\.?0+$/, '')}
                onChange={handleInputChange}
                className="slider-input slider-value"
            />
        </div>
    );
}

export {Slider,singletonUpdater};
