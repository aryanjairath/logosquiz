import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header/Header';
import Image from './components/Image/Image';
import Options from './components/Options/Options';

function App() {
  const [logos, setLogos] = useState([]);
  const [logo, setLogo] = useState([])
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const[number, setNumber] = useState(0)
  const [visited, setVisited] = useState([])
  const [gameOver, setGameOver] = useState(false);
  const [shouldRestart, setShouldRestart] = useState(false);  // Added this line
  const [attempted, setAttempted] = useState(0)

  useEffect(() => {
    setQuestions([5,10,15,20]);
    const fetchLogo = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/logos');
        setLogos(response.data);
        generateQuestion(response.data, []);  // Modified to pass empty visited array
      } catch (error) {
        console.error('Error fetching logos:', error);
      }
    };
    fetchLogo();
  }, []);

  // Added this useEffect for restart handling
  useEffect(() => {
    if (shouldRestart) {
      setScore(0);
      setVisited([]);
      setGameOver(false);  // Added to ensure game over state is reset
      generateQuestion(logos, []);  // Pass empty visited array on restart
      setShouldRestart(false);
      setAttempted(0);
      setNumber(0);
    }
  }, [shouldRestart, logos]);

  const handleguess = (option) => {
    setAttempted(attempted + 1)
    if (gameOver) return;
    
    if (option === logo.name) {
      setScore(prev => prev + 1);
    }
    generateQuestion(logos, visited);
  }
  const handlequestion = (option) => {
    setNumber(option)
  };

  // Modified to accept visitedList parameter
  const generateQuestion = (logosList, visitedList = visited) => {
    if (attempted === number-1 && number != 0) {
      setGameOver(true);
      return;
    }

    let randomIndex;
    let attempts = 0;
    do {
      randomIndex = Math.floor(Math.random() * logosList.length);
      attempts++;
    } while (visitedList.includes(logosList[randomIndex].name) && attempts < logosList.length * 2);

    if (attempts >= logosList.length * 2) {
      setGameOver(true);
      return;
    }

    const newLogo = logosList[randomIndex];
    setLogo(newLogo);
    setVisited([...visitedList, newLogo.name]);

    const filler = [newLogo.name];
    while (filler.length < 4) {
      const randomOption = logosList[Math.floor(Math.random() * logosList.length)].name;
      if (!filler.includes(randomOption)) {
        filler.push(randomOption);
      }
    }

    setOptions(filler);
  };

  // Modified restart handler to use shouldRestart
  const onRestart = () => {
    setShouldRestart(true);
  };

  return (
    <div>
      <Header />
      {number === 0 && <h2>How many problems would you like?</h2> }
      {number === 0 && <Options options={questions} handleGuess = {handlequestion} /> }
      <Image image={logo} />
      <Options options={options} handleGuess={handleguess}/>
      <h1>Your current score is {score}</h1>
      {gameOver && (
        <div>
          <h1>The game is over. Good work</h1>
          <button onClick={onRestart}>Wanna restart?</button>
        </div>
      )}
    </div>
  );
}

export default App;