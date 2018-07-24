import React from 'react'

const Input = (props) => {
    return <p>{props.text}: <input value={props.value} onChange={props.onChange} /> </p>
}

export default Input;