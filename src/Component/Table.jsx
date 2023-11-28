import React from 'react'

const Table = (props) => {
    return (
        <div id="tablerow">
            <h3 id='tablecontent'>{props.content1} </h3>
            <h3 style={{marginLeft:"50px",textAlign:"right"}} id='tablecontent'>{props.content2}</h3>
        </div>
    )
}

export default Table