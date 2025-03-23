import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';

// const ALL_VALUES_PULL = ["🎃", "🤡", "💀", "🐶", "🐙"]
const NUMBER_OF_SCROLLS = 15
const BG_COLORS = {
  bright: "#36464f",
  dull: "#20282d",
  default: "#1c1f26"
}

function App() {
  const[currentValues, setCurrentValues] = useState([])
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [targetBGColor, setTargetBGColor] = useState(null)
  const [isBGAnimating, setIsBGAnimating] = useState(false)
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

    let realValues = [currentValues[0], currentValues[1], currentValues[2]]
    console.log("realValues START: ", realValues)

    let i = 0
    intervalId = setInterval(() => {

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
      } else {
        clearInterval(intervalId);
        setIsButtonDisabled(false)
        if ((realValues[0] === realValues[1]
          || realValues[0] === realValues[2]
          || realValues[1] === realValues[2])
          && !(realValues[0] === realValues[1] === realValues[2])) {
          setTargetBGColor(BG_COLORS.dull)
          setIsBGAnimating(true)
          setTimeout(() => {setIsBGAnimating(false)}, 10)
        }
        else if (realValues[0] === realValues[1] === realValues[2]) {
          setTargetBGColor(BG_COLORS.bright)
          setIsBGAnimating(true)
          setTimeout(() => {setIsBGAnimating(false)}, 10)
        }
        console.log(realValues)
      }
      i++
      }, 80)
  }


  return (<motion.div
    className="background"
    variants={backgroundVariants}
    animate={isBGAnimating ? "light" : "dark"}
  >
    <div className="scoreboard-hd">
      <div className="scoreboard-els-holder">
        <span className="scoreboard-el">{currentValues[0]}</span>
        <span className="scoreboard-el">{currentValues[1]}</span>
        <span className="scoreboard-el">{currentValues[2]}</span>
      </div>
      <button className={isButtonDisabled ? "button button-disabled" : "button"} onClick={handleClick}>Крутить</button>
    </div>
    <p>У вас есть возможность семь раз нажать на кнопку. Смысл - набрать больше 100 баллов.<br/>
      За три совпадения - 25 баллов<br/>
      За два совпадения - 15 баллов<br/>
      За ноль совпадений - 5 баллов</p>
  </motion.div>)

}

export default App;
