import React from 'react'

const Card = (props) => {
    return (
        <div id='cardmain'>
            <h1 id='cardmaintitle' >{props.content}</h1>
            <img id="cardimg" src={props.imglink} alt="" />
            <h1 id='cardtitle'>{props.name}</h1>
            <h4 id='cardsub'>{props.price}</h4>
            <h1 onClick={(e) => {props.playloadhandler(props.playload),props.msg(props.name),props.hider(false)}} style={{ cursor: 'pointer' }} id='cardbtn'>{props.btn}</h1>
        </div>
    )
}

export default Card