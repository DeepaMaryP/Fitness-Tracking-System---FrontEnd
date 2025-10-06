import React, { useEffect, useState } from 'react'

function DynamicDropdown(props) {
    
    const { item, name, selectedItem, onData, readOnly } = props;
    const [selectedValue, setSelectedValue] = useState(selectedItem)

    useEffect(() => {
        setSelectedValue(selectedItem)
    }, [selectedItem]
    )


    function handleChange(event) {
        setSelectedValue(event.target.value)
        onData(event.target.value)
    }

    return (
        <div>
            <select onChange={handleChange} value={selectedValue}   className={`border w-72 rounded p-2 ${
          readOnly ? "bg-gray-100 pointer-events-none text-gray-600" : ""  }`}>           
                <option value=""> {name}</option>
                {item.map(option =>
                    <option key={option.value} value={option.value}>{option.label}</option>
                )}
            </select>
        </div>
    )
}

export default DynamicDropdown
