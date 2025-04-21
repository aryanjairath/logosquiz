import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import axios, { getAdapter } from 'axios';
// import Header from './components/Header/Header';
// import Image from './components/Image/Image';
// import Options from './components/Options/Options';
import Welcome from './components/Welcome/Welcome';
import Leaderboard from './components/Leaderboard/Leaderboard';
import Game from './Game/Game';

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
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false)
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
    const submitScore = async () => {
      if (gameOver && !hasSubmittedScore){
        const data = {
          username: name,
          time: time,
          score: score,
          totalQuestions: attempted
        };
        axios.post("http://localhost:5000/api/leaderboard", data)
        setHasSubmittedScore(true)
        return;
      } 
    }
    submitScore()
  }, [gameOver, hasSubmittedScore]);

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
      setHasSubmittedScore(false);
      setName('')
      setTime(0);
      navigate('/');
    }
  }, [shouldRestart, logos]);

  const handleguess = (option) => {
    if(gameOver)
      return;
    setAttempted(attempted + 1)
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

  const onLeaderboard = () => {
    navigate('/leaderboard');
  }

  return (
      <Routes>
        <Route path = '/' element = {
          <div>
            <Welcome name = {name} handleEnterPress = {handleEnterPress} questions = {questions} handlequestion = {handlequestion} />
          </div>
        } />
        <Route path="/game" element={
          <Game 
            name = {name} 
            time = {time} 
            handleEnterPress = {handleEnterPress} 
            handleguess = {handleguess}
            onRestart = {onRestart}
            onLeaderboard = {onLeaderboard}
            gameOver = {gameOver}
            logo = {logo}
            options = {options}
            score = {score}
          />
        } />

        <Route path = '/leaderboard' element = {
          <> 
            <Leaderboard setName={setName} setShouldRestart = {setShouldRestart}/>
          </>
        } />

    </Routes>
  );
}

export default App;