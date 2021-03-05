import React from "react"
import classes from './Backdrop.module.css'
const Backdrop=(props)=>{
    return <div onClick={props.change} className={classes.Backdrop} style={{backgroundColor:props.color,opacity:props.opacity}}></div>
}

export default Backdrop