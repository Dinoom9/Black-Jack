import React, { useEffect, useState } from 'react'
import Styles from "./StartGameModal.module.scss"
import 'animate.css'


export default function StartGameModal({ startTheGame, message, anotherRound = false, closeModal }) {
    const [startSpinning, setStartSpinning] = useState(false)

    // Spinning button animation timeout
    useEffect(() => {
        if (startSpinning) {
            setTimeout(() => {
                startTheGame()
            }, 500)
        }
    }, [startSpinning])

    return (
        <div className={Styles.StartGameModalContainer} onClick={closeModal}>
            <div className={`${Styles.StartGameModal} ${!anotherRound ? 'animate__animated animate__fadeIn' : ""}`} onClick={(e) => e.stopPropagation()}>
                <h2>Black <span>Jack</span></h2>
                <div className={Styles.LabelAndButtonContainer}>
                    <span>{message}</span>
                    {!anotherRound ? <div className={`${Styles.ImgButton} ${startSpinning ? Styles.SpinningButton : null}`} onClick={() => setStartSpinning(true)}>
                        <img src={require("../../assets/blackJackChip-removebg.png")} alt="chip button" ></img>
                        <span>START!</span>
                    </div>
                        :
                        <span className={Styles.StartGameModalButtonsContainer}>
                            <button title='New game' onClick={startTheGame}>New game</button>
                            <button title='Cancel' onClick={closeModal}>Cancel</button>
                        </span>
                    }
                </div>
            </div>
        </div>
    )
}
