import React from 'react'

const Titlecardtemp = (props) => {
    return (
        <div>
            <h2 id='cardtitletemp'>{props.content}</h2>
            <a target="_blank" href={props.btn}><h1 onClick={(e) => {props.playloadhandler("You will soon be redirected to the page."),props.hider(false),props.msg("view the page")}} style={{ cursor: 'pointer' }} id='cardbtn'>View the page</h1></a>
        </div>
    )
}

export default Titlecardtemp