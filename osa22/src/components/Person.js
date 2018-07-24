import React from 'react'


const Person = ({ person, text, handleClick }) => {
    return (
        <tr><td>{person.name}</td><td>{person.number}</td><td><Button id={person.id} handleClick={handleClick} text={text} /></td></tr>
    )
}

const Button = ({ handleClick, id, text }) => {
    return (
        <button onClick={handleClick}>
            {text}
        </button>
    )

}

export default Person;