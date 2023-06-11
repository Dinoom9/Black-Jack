import React from 'react'
import Styles from './MyButton.module.scss'


export default function MyButton({ label, onClickFunction }) {
    return (
        <button className={Styles.MyButton} title='myButton' onClick={onClickFunction}>{label}</button>
    )
}
