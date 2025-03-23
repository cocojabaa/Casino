import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import useSound from "use-sound";
import timerSound from "./assets/timer.mp3"
import readySound from "./assets/ready.mp3";
import endScrollingSound from "./assets/end_scrolling.mp3";

// const ALL_VALUES_PULL = ["🎃", "🤡", "💀", "🐶", "🐙"]
const NUMBER_OF_SCROLLS = 15
const BG_COLORS = {
  bright: "#4e6979",
  dull: "#20282d",
  default: "#1c1f26"
}
const POINTS = {
  oneCoincidence: 10,
  twoCoincidences: 15,
  threeCoincidences: 25,
}

function App() {
  const[currentValues, setCurrentValues] = useState([])
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [targetBGColor, setTargetBGColor] = useState(null)
  const [isBGAnimating, setIsBGAnimating] = useState(false)
  const [playTimerSound, {stop}] = useSound(timerSound);
  const [playReadySound] = useSound(readySound);
  const [playEndScrollingSound] = useSound(endScrollingSound);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(7);
  const backgroundVariants = {
    light: {background: `linear-gradient(${targetBGColor}, #111218)`, transition: {duration: 0}},
    dark: {background: "linear-gradient(#1c1f26, #111218)", transition: {duration: .8}},
  }
  const availableValues = [
    ["🎃", "💀", "🐶", "🐙"],
    ["🎃", "💀", "🐶", "🐙"],
    ["🎃", "💀", "🐶", "🐙"]
  ]

  function getRandomValue(current, index) {
    const randomIndex = Math.floor(Math.random() * availableValues[index].length)
    const randomValue = availableValues[index][randomIndex]
    availableValues[index].splice(randomIndex, 1)
    availableValues[index].push(current)
    return randomValue
  }

  let intervalId = 0

  useEffect(() => {
    setCurrentValues(['🤡', '🤡', '🤡'])
    return () => clearInterval(intervalId) // Очистка при размонтировании
  }, [])

  function handleClick() {
    setIsButtonDisabled(true)
    setAttempts((prev) => {return prev - 1})

    playTimerSound()

    let realValues = [currentValues[0], currentValues[1], currentValues[2]]
    console.log("realValues START: ", realValues)

    let i = 0
    intervalId = setInterval(() => {
      if (i === NUMBER_OF_SCROLLS) {
        playReadySound()
      }
      if (i === NUMBER_OF_SCROLLS * 2) {
        playReadySound()
      }
      if (i === NUMBER_OF_SCROLLS * 3) {
        playEndScrollingSound()
      }

      if (i < NUMBER_OF_SCROLLS) {
        realValues = [
          getRandomValue(realValues[0], 0),
          getRandomValue(realValues[1], 1),
          getRandomValue(realValues[2], 2)
        ]
        setCurrentValues((prev) => realValues)
      } else if (i < NUMBER_OF_SCROLLS * 2) {
        realValues = [
          realValues[0],
          getRandomValue(realValues[1], 1),
          getRandomValue(realValues[2], 2)
        ]
        setCurrentValues((prev) => realValues)
      } else if (i < NUMBER_OF_SCROLLS * 3) {
        realValues = [
          realValues[0],
          realValues[1],
          getRandomValue(realValues[2], 2)
        ]
        setCurrentValues((prev) => realValues)
      } else if (i > NUMBER_OF_SCROLLS * 3) {
        clearInterval(intervalId);
        console.log(realValues)
        stop()
        if (attempts > 1) setIsButtonDisabled(false) // attempts > 1 потому что я не понимаю как здесь обновляются состояния
        else {
          document.querySelector(".attempts-text").style.color = "#da2121"
        }

        if ((realValues[0] === realValues[1]
          || realValues[0] === realValues[2]
          || realValues[1] === realValues[2])
          && !(realValues[0] === realValues[1] === realValues[2])) {
          setScore((prev) => {
            return prev + POINTS.twoCoincidences
          })
          setTargetBGColor(BG_COLORS.dull)
          setIsBGAnimating(true)
          setTimeout(() => {setIsBGAnimating(false)}, 10)
        }
        else if (realValues[0] === realValues[1] === realValues[2]) {
          setScore((prev) => {
            return prev + POINTS.threeCoincidences
          })
          setTargetBGColor(BG_COLORS.bright)
          setIsBGAnimating(true)
          setTimeout(() => {setIsBGAnimating(false)}, 10)
        }
        else {
          setScore((prev) => {
            return prev + POINTS.oneCoincidence
          })
        }
      }
      i++
      }, 80)
  }


  return (<motion.div
    className="background"
    variants={backgroundVariants}
    animate={isBGAnimating ? "light" : "dark"}
  >
    <span className="score-text">Score: {score}</span>
    <span className="attempts-text">Attempts: {attempts}</span>
    <div className="scoreboard-holder">
      <div className="scoreboard-els-holder">
        <span className="scoreboard-el">{currentValues[0]}</span>
        <span className="scoreboard-el">{currentValues[1]}</span>
        <span className="scoreboard-el">{currentValues[2]}</span>
      </div>
      <button className={isButtonDisabled ? "button button-disabled" : "button"} onClick={handleClick}>Крутить</button>
    </div>
    <p>У вас есть возможность 7 раз нажать на кнопку. Смысл - набрать больше 100 баллов.<br/>
      За три совпадения - {POINTS.threeCoincidences} баллов<br/>
      За два совпадения - {POINTS.twoCoincidences} баллов<br/>
      За ноль совпадений - {POINTS.oneCoincidence} баллов</p>
  </motion.div>)

}

export default App;
