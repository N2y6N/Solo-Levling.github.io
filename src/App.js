import { useState, useEffect } from "react";
import { GiRank3, GiAchievement, GiBookCover, GiTimeBomb, GiSpellBook, GiDeadlyStrike, GiRaiseZombie } from "react-icons/gi";
import { Button } from "./components/ui/button";
import { Progress } from "./components/ui/progress";
import './styles.css';

const bosses = [
  { name: "incursion", hp: 5000},
  { name: "onslaught", hp: 15000},
  { name: "siege", hp: 30000},
  { name: "annihilation", hp: 60000},
];

const xpSources = [
  { name: "Study for 1 hour", xp: 100, icon: <GiTimeBomb /> },
  { name: "Solve Practice Questions", xp: 150, icon: <GiSpellBook /> },
  { name: "Study for 2 hours", xp: 200, icon: <GiTimeBomb /> },
  { name: "Finish a Chapter", xp: 350, icon: <GiBookCover /> },
  { name: "Wrote notes and studied", xp: 900, icon: <GiRaiseZombie /> },
  { name: "Complete Subject Revision", xp: 1000, icon: <GiAchievement /> },
  { name: "100 questions in one go", xp: 1050, icon: <GiDeadlyStrike /> },
  { name: "Followed Timetable", xp: 2000, icon: <GiAchievement /> },
];

const moves = [
  { name: "Mind Slash", cost: 200, damage: 300 },
  { name: "Ultra Move", cost: 700, damage: 1400 },
  { name: "Short Range", cost: 100, damage: 200 },
  { name: "BLACK FLASH", cost: 7000, damage: 14000 },
];

const ranks = [
  { name: "Novice Hunter", xp: 0 },
  { name: "Elite Scholar", xp: 15000},
  { name: "Champion Grasper", xp: 30000},
  { name: "GOD", xp: 60000},
];

export default function StudyBossBattle() {
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem("xp")) || 0);
  const [bossIndex, setBossIndex] = useState(() => parseInt(localStorage.getItem("bossIndex")) || 0);
  const [bossHp, setBossHp] = useState(() => parseInt(localStorage.getItem("bossHp")) || bosses[bossIndex].hp);
  const [rank, setRank] = useState(ranks[0]);
  const [gameComplete, setGameComplete] = useState(() => JSON.parse(localStorage.getItem("gameComplete")) || false);
  const [breakTime, setBreakTime] = useState(0);
  const [showBreakOptions, setShowBreakOptions] = useState(false);
  
  // New states for double XP feature
  // dailyXp is tracked per calendar day; if the stored date isn’t today, it resets to 0.
  const [dailyXp, setDailyXp] = useState(() => {
    const storedDate = localStorage.getItem("dailyXpDate");
    const today = new Date().toISOString().slice(0, 10);
    if (storedDate !== today) {
      localStorage.setItem("dailyXpDate", today);
      return 0;
    }
    return parseInt(localStorage.getItem("dailyXp")) || 0;
  });
  const [doubleXp, setDoubleXp] = useState(() => JSON.parse(localStorage.getItem("doubleXp")) || false);
  const [doubleXpEndTime, setDoubleXpEndTime] = useState(() => parseInt(localStorage.getItem("doubleXpEndTime")) || 0);
  // State for countdown timer (in seconds) for double XP mode
  const [doubleXpRemaining, setDoubleXpRemaining] = useState(0);
  
  useEffect(() => {
    localStorage.setItem("xp", xp);
    localStorage.setItem("bossIndex", bossIndex);
    localStorage.setItem("bossHp", bossHp);
    localStorage.setItem("gameComplete", JSON.stringify(gameComplete));
    localStorage.setItem("dailyXp", dailyXp);
    localStorage.setItem("doubleXp", JSON.stringify(doubleXp));
    localStorage.setItem("doubleXpEndTime", doubleXpEndTime);
  }, [xp, bossIndex, bossHp, gameComplete, dailyXp, doubleXp, doubleXpEndTime]);

  useEffect(() => {
    const newRank = ranks.slice().reverse().find((r) => xp >= r.xp) || ranks[0];
    setRank(newRank);
  }, [xp]);

  useEffect(() => {
    if (bossHp === 0 && bossIndex < bosses.length - 1) {
      setTimeout(() => {
        setBossIndex((prev) => {
          const newIndex = prev + 1;
          setBossHp(bosses[newIndex].hp);
          return newIndex;
        });
        setXp((prevXp) => prevXp + 500);
      }, 1500);
    } else if (bossHp === 0 && bossIndex === bosses.length - 1) {
      setGameComplete(true);
    }
  }, [bossHp, bossIndex]);

  useEffect(() => {
    if (breakTime > 0) {
      const interval = setInterval(() => {
        setXp((prev) => Math.max(prev - 1, 0));
        setBreakTime((prev) => prev - 1);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [breakTime]);
  
  // Disable double XP after the 1-hour duration
  useEffect(() => {
    if (doubleXp && Date.now() > doubleXpEndTime) {
      setDoubleXp(false);
    }
  }, [doubleXp, doubleXpEndTime]);
  
  // Countdown timer for double XP mode
  useEffect(() => {
    if (doubleXp) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.floor((doubleXpEndTime - Date.now()) / 1000));
        setDoubleXpRemaining(remaining);
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setDoubleXpRemaining(0);
    }
  }, [doubleXp, doubleXpEndTime]);

  const handleMove = (move) => {
    if (xp >= move.cost && bossHp > 0) {
      setXp((prevXp) => prevXp - move.cost);
      setBossHp((prevHp) => Math.max(prevHp - move.damage, 0));
    }
  };

  const earnXp = (amount) => {
    // Calculate XP to add, doubling if doubleXp is active
    const xpToAdd = doubleXp ? amount * 2 : amount;
    setXp((prev) => prev + xpToAdd);
    // Update daily XP based on the base amount (not the doubled value)
    setDailyXp((prev) => {
      const newDailyXp = prev + amount;
      // Activate double XP for 1 hour if 5000 XP is reached in a day and it's not already active
      if (newDailyXp >= 5000 && !doubleXp) {
        setDoubleXp(true);
        setDoubleXpEndTime(Date.now() + 3600000);
      }
      return newDailyXp;
    });
  };

  const startBreak = (minutes) => {
    setBreakTime(minutes);
    setShowBreakOptions(false);
  };

  const toggleBreakOptions = () => {
    setShowBreakOptions(!showBreakOptions);
  };

  if (gameComplete) {
    return (
      <div className="game-container" style={{ backgroundImage: `url(${rank.bg})` }}>
        <h1 className="text-5xl font-bold mb-4 text-green-400">😐 You Better Get That Damn FULL A+ 😐</h1>
        <Button onClick={() => { 
          setXp(0);
          setBossIndex(0);
          setBossHp(bosses[0].hp);
          setGameComplete(false);
          setDailyXp(0);
          setDoubleXp(false);
        }} className="mt-4 bg-blue-500 text-white hover:bg-blue-700">
          Restart Game
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Embedded styles for the flicker effect and dark glow */}
      <style>
        {`
          @keyframes flicker {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          .flicker {
            animation: flicker 5s infinite;
            text-shadow: 0 0 8px #000;
          }
        `}
      </style>
      <div className="game-container" style={{ backgroundImage: `url(${rank.bg})` }}>
        <h1 className="text-5xl font-bold mb-4">⚔️ {bosses[bossIndex].name} ⚔️</h1>
        <img src={bosses[bossIndex].image} alt={bosses[bossIndex].name} className="boss-image" />
        
        <Progress value={(bossHp / bosses[bossIndex].hp) * 100} />
        <p>Boss HP: {bossHp} / {bosses[bossIndex].hp}</p>
        <Progress value={(xp / ranks[ranks.length - 1].xp) * 100} />
        <p>
          XP: {xp} 
          {doubleXp && (
            <span 
              className="flicker" 
              style={{ marginLeft: '1rem', color: 'red', fontWeight: 'bold' }}
            >
              Double XP for 1 hour
            </span>
          )}
        </p>
        <p>Rank: {rank.name} <GiRank3 /></p>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {xpSources.map((source) => (
            <Button key={source.name} onClick={() => earnXp(source.xp)} className="xp-box">
              {source.icon} {source.name} (+{source.xp} XP)
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {moves.map((move) => (
            <Button key={move.name} onClick={() => handleMove(move)} className="attack-box">
              ⚔️ {move.name} (-{move.cost} XP, {move.damage} DMG)
            </Button>
          ))}
        </div>

        <p>Break Time Left: {Math.floor(breakTime / 60)}h {breakTime % 60}m</p>
      </div>
      <button className="break-button" onClick={toggleBreakOptions}>
        Stand Down
      </button>
      <div className={`break-options ${showBreakOptions ? "show" : ""}`}>
        <Button onClick={() => startBreak(60)}>1 Hour Break</Button>
        <Button onClick={() => startBreak(120)}>2 Hour Break</Button>
        <Button onClick={() => startBreak(180)}>3 Hour Break</Button>
      </div>
      {doubleXp && (
        <div 
          style={{
            position: 'fixed',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '0.9rem'
          }}
          className={doubleXpRemaining < 600 ? "flicker" : ""}
        >
          Double XP ends in: {Math.floor(doubleXpRemaining / 60)}:{('0' + (doubleXpRemaining % 60)).slice(-2)}
        </div>
      )}
    </>
  );
}
