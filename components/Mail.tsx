import React from 'react'

export default function(props:any){
    return(
        <div style={{border:'1px solid black',
        margin:'10px',width:'20%'}}>
            <p>{props.name}</p>
            <p>{props.content}</p>
        </div> 
    )   
}