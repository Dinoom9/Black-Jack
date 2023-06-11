import React, { useEffect, useState } from 'react'
import Styles from "./MyCards.module.scss"



export default function MyCards({ card, moveLeft, index, flipCard }) {
    const [flipped, setFlipped] = useState(false);
    const [switchFrontBackImg, setSwitchFrontBackImg] = useState(false);

    // useEffect that set a small timeout so the flip animation can run properly
    useEffect(() => {
        if (index > 0 || flipCard) {
            setFlipped(true);
            const timeoutId = setTimeout(() => {
                setSwitchFrontBackImg(true)
            }, 100);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, []);

    return (
        <div className={`${Styles.CardContainer} ${flipped ? Styles.FlipVerticalLeft : ''}`} style={{ left: `${moveLeft}%` }}>
            {switchFrontBackImg ? (
                <img src={card[0].image} alt="Playing card" />
            ) : (
                <img src={require("../../assets/cardsdeck.png")} alt="Unflipped card" style={{ height: "385px" }} />
            )}
        </div>
    );
}


