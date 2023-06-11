import React from 'react'
import Styles from './Messages.module.scss'
import 'animate.css'

export default function Messages({ message }) {

    return (
        <span className={`${Styles.MessageSpan}`}>{message}</span>
    )
}