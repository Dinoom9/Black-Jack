import React, { useEffect, useState } from 'react'
import Styles from "./PlayArea.module.scss"

import StartGameModal from '../StartGameModal/StartGameModal.cmp'
import axios from "axios"
import "animate.css"
import MyCards from '../MyCard/MyCards.cmp'
import Messages from '../Messages/Messages.cmp'
import MyButton from '../MyButtonCmp/MyButton.cmp'

// let rotateDegUser = 326;
// let rotateDegComputer = 45;
export default function PlayArea() {
    const [startGame, setStartGame] = useState(true)
    const [deckOfCards, setDeckOfCards] = useState([])
    const [userHand, setUserHand] = useState([])
    const [computerHand, setComputerHand] = useState([])
    const [flipHiddenCard, SetFlipHiddenCard] = useState(false)
    const [finishGame, setFinishGame] = useState(false)
    const [takeTurn, setTakeTurn] = useState(true)
    const [subTotalScore, setSubTotalScore] = useState({ userScore: 0, computerScore: 0 })
    const [hasFetched, setHasFetched] = useState(false);
    const [messages, setMessages] = useState("")
    const [startNewGame, setStartNewGame] = useState(false)

    // Function that closes the start game modal and sets a flag to render all the other compoenents
    const startTheGame = () => {
        if (deckOfCards.length && finishGame) {
            setDeckOfCards([]);
            setUserHand([]);
            setComputerHand([]);
            setTakeTurn(true);
            setSubTotalScore({ userScore: 0, computerScore: 0 });
            setMessages("");
            setHasFetched(false);
            setFinishGame(false);
            SetFlipHiddenCard(false);
            setStartNewGame(false);
        }
        setStartGame(false);
    }


    // Fetch cards async function that fetches the cards deck from the server
    const fetchCards = async () => {
        try {
            const { data } = await axios.get("http://localhost:3001/fetchCards")
            return data[0]
        } catch (err) {
            console.error(err)
        }
    }
    // useEffect that calls the fetchCards function and sets the deck fetched into the cards array plus deals the initial cards for the players.
    useEffect(() => {
        if (!finishGame) {
            const fetchData = async () => {
                if (!hasFetched) {
                    try {
                        const cardsDeck = await fetchCards();
                        dealCards(cardsDeck.cards);
                        setHasFetched(true)
                    } catch (error) {
                        console.error(error);
                    }
                }
            };

            fetchData();
        }
    }, [finishGame])

    // function that deal the inital cards for the players
    const dealCards = (cardsDeck) => {
        let twoUserRandomCards = [];
        let twoComputerRandomCards = [];
        let userScore = 0;
        let computerScore = 0;
        let random = 52;
        // for loop that runs 2 times and get 4 random cards from the deck, 2 for the player and 2 for the computer hand
        for (let i = 0; i < 2; i++) {
            twoUserRandomCards.push(cardsDeck.splice(Math.floor(Math.random() * random), 1))
            userScore += addCardToScore(twoUserRandomCards.at(-1), "userScore")
            random = random - 1
            twoComputerRandomCards.push(cardsDeck.splice(Math.floor(Math.random() * random), 1))
            computerScore += addCardToScore(twoComputerRandomCards.at(-1), "computerScore")
            random = random - 1
        }

        setUserHand(twoUserRandomCards);
        setComputerHand(twoComputerRandomCards);
        setSubTotalScore({ userScore, computerScore });
        setDeckOfCards(cardsDeck);
        setMessages("Your turn!");
    }
    // function that after each turn sets the new score into the scores state
    const addCardToScore = (card, player) => {
        // switch case that changes the value of the cards on demand, king/queen/jack equals 10 and ace 1 or 11 depends whats better for the current player hand.
        switch (card[0].value) {
            case "KING":
            case "QUEEN":
            case "JACK":
                return 10;

            case "ACE":
                if (subTotalScore[`${player}`] + 11 > 21) {
                    return 1;
                } else {
                    return 11;
                }

            // default case returns the value of the "regular" cards
            default:
                return Number(card[0].value);
        }
    }

    // useEffect that change the turn between the players.
    useEffect(() => {
        if (!takeTurn) {
            hitFunction(false)
        }
        else {
            setTakeTurn(true)
        }
    }, [takeTurn])

    // hit function that the user or computer runs to take a new card, user will press a button to call it while the computer do it randomly and only if his hand score < 16.
    const hitFunction = (turn) => {
        let randomCard = [];
        let random = deckOfCards.length;
        let userScore = 0;
        let computerScore = 0;
        // this is the user turn
        if (turn) {
            // a random card from the deck is added to the user hand, and its value is added to the user sub total
            for (let i = 0; i < 1; i++) {
                randomCard.push(deckOfCards.splice(Math.floor(Math.random() * random), 1))
                userScore = addCardToScore(randomCard[0], "userScore")
                random = random - 1
            }

            userScore += subTotalScore["userScore"]
            setDeckOfCards(deckOfCards)
            setUserHand((prevValue) => [...prevValue, randomCard[0]])
            setSubTotalScore((prevValue) => { return { ...prevValue, userScore: userScore } })
            // if the score is above 21, the user "Busts" and loses the game.
            if (userScore > 21) {
                setMessages("Busted!")
                endTheGame()
            }
            // else the turn moves to the dealer
            else {
                setMessages("Opponent turn!")
                setTimeout(() => {
                    setTakeTurn(false)
                }, 3000)
            }
        }
        // this is the computer turn, if his hand hold 16 or less it will randomly chose if to pick a card in ratio of 1/3 to pick.
        else if (subTotalScore["computerScore"] <= 16) {
            if (Math.floor(Math.random() * 3) > 0) {
                for (let i = 0; i < 1; i++) {
                    randomCard.push(deckOfCards.splice(Math.floor(Math.random() * random), 1))
                    computerScore = addCardToScore(randomCard[0], "computerScore")
                    random = random - 1
                }

                computerScore += subTotalScore["computerScore"]
                setDeckOfCards(deckOfCards)
                setComputerHand((prevValue) => [...prevValue, randomCard[0]])
                setSubTotalScore((prevValue) => { return { ...prevValue, computerScore: computerScore } })
            }
            // same like the user, score is higher than 21, the user wins and the game is over.
            if (computerScore > 21) {
                setMessages("You WON!")
                endTheGame()
            }
            else {
                setMessages("Your turn!")
                setTakeTurn(true)
            }
        } else {
            setMessages("Your turn!")
            setTakeTurn(true)
        }
    }

    // function that ends the game, flips the dealer hidden card and after a timeout for the message to run on the screen finished the game and opens a modal that asks if you want to play a new game.
    const endTheGame = async () => {
        SetFlipHiddenCard(true)
        setTimeout(() => {
            setFinishGame(true)
        }, 3000)

    }

    // function that end the game and everyone shows their cards and checks who won.
    const standFunction = () => {
        if (subTotalScore["userScore"] > subTotalScore["computerScore"]) {
            setMessages("You WON!")
            endTheGame()

        } else if (subTotalScore["userScore"] < subTotalScore["computerScore"]) {
            setMessages("You lost")
            endTheGame()
        }
        else {
            setMessages("All Ties, Dealer Wins!")
            endTheGame()
        }
    }

    // Dynamic function that closes or opens the new game modal
    const openAndCloseNewGameModal = (openOrClose) => {
        if (openOrClose) {
            setStartNewGame(true)
            setFinishGame(true);
        }
        else {
            setStartNewGame(false)
            setFinishGame(false);
        }
    }


    return (
        <div className={Styles.PlayAreaContainer}>
            {!startGame && !finishGame &&
                <>
                    <Messages message={messages} key={Math.random()} />
                    <div className={Styles.DeckOfCardsContainer} style={{ visibility: finishGame ? "hidden" : "" }}>
                        <button className={`${Styles.HitButton} animate_animated animatefadeIn animate_faster`} onClick={() => hitFunction(true)}>{takeTurn && `Hit`}</button>
                        <button className={Styles.StandButton} onClick={standFunction}>Stand</button>
                    </div>
                    <div className={`${Styles.DecksArea}`}>
                        <span>
                            {computerHand.map((card, index) => {
                                let leftPosition = 6 * index;
                                return <MyCards card={card} key={index !== 0 ? `${card.code}_${index}` : Math.random()} moveLeft={leftPosition} index={index} flipCard={flipHiddenCard} />
                            })}
                        </span>
                        <span>

                            {userHand.map((card, index) => {
                                let leftPosition = 6 * index;
                                return <MyCards card={card} key={`${card.code}_${index}`} moveLeft={leftPosition} index={1} flipCard={flipHiddenCard} />
                            })}
                        </span>

                    </div>
                    <span className={Styles.PlayAreaButtonsContainer}>
                        <MyButton label={"New Game"} onClickFunction={() => openAndCloseNewGameModal(true)} />
                    </span>
                </>
            }
            {startGame && <StartGameModal startTheGame={startTheGame} message={"Are you ready to play some Black Jack?"} />}
            {finishGame && <StartGameModal startTheGame={startTheGame} message={"Are you ready for another round?"} />}
            {startNewGame && <StartGameModal startTheGame={startTheGame} message={"Start a new game?"} anotherRound={startNewGame} closeModal={() => openAndCloseNewGameModal(false)} />}
        </div>
    )
}
