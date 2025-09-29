import React, { useEffect, useState } from 'react'

function DynamicDropdown(props) {
    const options = props.item
    const optionCategory = props.name
    const selectedItem = props.selectedItem
    const [selectedValue, setSelectedValue] = useState(selectedItem)

    useEffect(() => {
        setSelectedValue(selectedItem)
    }, [selectedItem]
    )


    function handleChange(event) {
        setSelectedValue(event.target.value)
        props.onData(event.target.value)
    }

    return (
        <div>
            <select onChange={handleChange} value={selectedValue} className='border w-72'>
                <option value=""> {optionCategory}</option>
                {options.map(option =>
                    <option key={option.value} value={option.value}>{option.label}</option>
                )}
            </select>
        </div>
    )
}

export default DynamicDropdown
