import "./Dropdown.css"
import React, { useState, useEffect, useRef } from 'react';
import {TextInput} from "flowbite-react";


const ArrowIcon = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        ></path>
    </svg>
);

const Autocomplete = ({ options, onSelect,onChange= (inputValue: string)=>{},onValidate=()=>{},className="" }) => {
    const [inputValue, setInputValue] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [showList, setShowList] = useState(false);
    const inputRef = useRef(null);
    const iconeRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowList(false);
        }else{
            setShowList(true);
        }
    };

    const handleInputChange = (event) => {
        const newInputValue = event.target.value;
        setInputValue(newInputValue);

        const newFilteredOptions = options.filter((option) =>
            option.toLowerCase().includes(newInputValue.toLowerCase())
        );
        setFilteredOptions(newFilteredOptions);
        onChange(newInputValue)
        setShowList(true);
    };

    const handleOptionClick = (option) => {
        setInputValue(option);
        setFilteredOptions(options);
        setShowList(false);
        onSelect(option);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            // Hide the list when the user presses the Escape key
            setShowList(false);
        }
        if (event.key == 'Enter') {

            const newFilteredOptions = options.filter((option) =>
                option.toLowerCase().includes(inputValue.toLowerCase())
            );

            if(newFilteredOptions.length>0){

                let selectEllement = newFilteredOptions[0]
                setInputValue(selectEllement);
                setFilteredOptions(options);
                setShowList(false);
                onSelect(selectEllement);
            }else{
                onValidate()
            }
        }
    };


    return (
        <div ref={inputRef} className={"autocomplet-parent "+className}>

            <TextInput
                type="text"
                required={true}
                rightIcon={ArrowIcon}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />


            {showList && filteredOptions.length > 0 && (
                <ul className="autocomplete-list">
                    {filteredOptions.map((option) => (
                        <li key={option} onClick={() => handleOptionClick(option)}>
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Autocomplete;

