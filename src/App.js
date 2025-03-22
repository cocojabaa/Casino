import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';

const ALL_VALUES_PULL = ["🎃", "🤡", "💀", "🐶", "🐙"]
const ITERS = 15

// Math.floor(Math.random() * ALL_VALUES_PULL.length)ф

function App() {
  let [currentValues, setCurrentValues] = useState([])
  let [isButtonDisabled, setIsButtonDisabled] = useState(false)

  let intervalId = 0

  useEffect(() => {
    console.log(123)
    setCurrentValues(["🤡", "🤡", "🤡"])
    return () => clearInterval(intervalId) // Очистка при размонтировании
  }, [])

  function handleClick() {
    setIsButtonDisabled(true)
    let i = 0
    intervalId = setInterval(() => {

      if (i < ITERS) {
        setCurrentValues((prev) => [
          ALL_VALUES_PULL[Math.floor(Math.random() * ALL_VALUES_PULL.length)],
          ALL_VALUES_PULL[Math.floor(Math.random() * ALL_VALUES_PULL.length)],
          ALL_VALUES_PULL[Math.floor(Math.random() * ALL_VALUES_PULL.length)]
        ])
      } else if (i < ITERS * 2) {
        setCurrentValues((prev) => [
          prev[0],
          ALL_VALUES_PULL[Math.floor(Math.random() * ALL_VALUES_PULL.length)],
          ALL_VALUES_PULL[Math.floor(Math.random() * ALL_VALUES_PULL.length)]
        ])
      } else if (i < ITERS * 3) {
        setCurrentValues((prev) => [
          prev[0],
          prev[1],
          ALL_VALUES_PULL[Math.floor(Math.random() * ALL_VALUES_PULL.length)]
        ])
      } else {
        setIsButtonDisabled(false)
        clearInterval(intervalId);
      }
      i++
      }, 80)
  }


  return (<motion.div
    className="background"
    initial={{backgroundColor: '#ff0000'}}
    animate={{backgroundColor: '#111218'}}
    transition={{
      duration: .2
    }}
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
