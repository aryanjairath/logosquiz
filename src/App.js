import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';

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
  const [number, setNumber] = useState(0)
  const [visited, setVisited] = useState([])
  const [gameOver, setGameOver] = useState(false);
  const [shouldRestart, setShouldRestart] = useState(false);  // Added this line
  const [attempted, setAttempted] = useState(0)
  const [time, setTime] = useState(0);
  const [gameStart, setGameStart] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setQuestions([5,10,15,20]);
    let interval;
    if (!gameOver && gameStart) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    // Clear the interval when the game is over or component unmounts
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
    return () => clearInterval(interval);

  }, [gameStart, gameOver]);

  useEffect(() => {
    if (shouldRestart) {
      setScore(0);
      setVisited([]);
      setGameOver(false);  // Added to ensure game over state is reset
      generateQuestion(logos, []);  // Pass empty visited array on restart
      setShouldRestart(false);
      setAttempted(0);
      setNumber(0);
      setGameStart(false);
      setName('')
      setTime(0);
      navigate('/');
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
    navigate('/game');
    setGameStart(true)
  };

  const handleEnterPress = (text) => {
    setName(text); 
  };

  const generateQuestion = (logosList, visitedList = visited) => {
    if (attempted === number-1 && number != 0) {
      const data = {
        username: name,
        time: time,
        score: score,
        totalQuestions: attempted+1
      };
      axios.post("http://localhost:5000/api/leaderboard", data)
      setGameOver(true);
      return;
    }
    console.log(name);

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

    let filler = [newLogo.name];
    while (filler.length < 4) {
      const randomOption = logosList[Math.floor(Math.random() * logosList.length)].name;
      if (!filler.includes(randomOption)) {
        filler.push(randomOption);
      }
      filler = shuffle(filler);
    }

    setOptions(filler);
  };
  const shuffle = (array) => {
    let currentIndex = array.length;
    while (currentIndex != 0) {

    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    return array;
  }

  }
  // Modified restart handler to use shouldRestart
  const onRestart = () => {
    setShouldRestart(true);
  };

  return (
      <Routes>
        <Route path = '/' element = {
          <div style = {{backgroundColor:'lightblue'}}>
            <Header onEnter={handleEnterPress}/>
            {name && <h2 style = {{textAlign:'center'}}>How many problems would you like?</h2>}
            {name && <Options options={questions} handleGuess = {handlequestion} />} 
          </div>
        } />
        <Route path="/game" element={
          <>
        <Header />
        <Image image={logo} /> 
        <Options options={options} handleGuess={handleguess}/> 
        <h1>Your current score is {score}</h1>
        {gameOver && (
          <div>
            <h1>The game is over. Good work</h1>
            <button onClick={onRestart}>Wanna restart?</button>
          </div>
        )}
        <h2 style = {{textAlign: 'center'}}>Time elapsed: {time}s</h2>
        </>
      } />
    </Routes>
  );
}

export default App;