import React from 'react'

const Button = (props) => {
    return (
        <div style={{textAlign:"center"}}>
            <h1 id='buttontemp' onClick={(e) => {props.playloadhandler(props.playload),props.hider(false)}} style={{ cursor: 'pointer' }}>{props.content}</h1>
        </div>
    )
}

export default Button