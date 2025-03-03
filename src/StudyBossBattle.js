import { useState, useEffect } from "react";
import { GiRank3, GiAchievement, GiBookCover, GiTimeBomb, GiSpellBook } from "react-icons/gi";
import { Button } from "./components/ui/button";
import { Progress } from "./components/ui/progress";
import { motion } from "framer-motion";
import './styles.css';
const bosses = [
  { name: "INCURSION", hp: 5000 },
  { name: "ONSLAUGHT", hp: 15000 },
  { name: "SIEGE", hp: 30000 },
  { name: "ANNIHILATION", hp: 60000 },
];

const xpSources = [
  { name: "Study for 1 hour", xp: 100, icon: <GiTimeBomb /> },
  { name: "Study for 2 hours", xp: 250, icon: <GiTimeBomb /> },
  { name: "Finish a Chapter", xp: 180, icon: <GiBookCover /> },
  { name: "Solve Practice Questions 2HRS", xp: 450, icon: <GiSpellBook /> },
  { name: "Complete Subject Revision", xp: 1200, icon: <GiAchievement /> },
  { name: "FOLLOWING TIMETABLE", xp: 2500, icon: <GiAchievement /> },
];

const moves = [
  { name: "Mind Slash", cost: 200, damage: 350 },
  { name: "Ultra Move", cost: 700, damage: 1500 },
  { name: "Short Range", cost: 120, damage: 250 },
  { name: "BLACK FLASH", cost: 7500, damage: 15000 },
];

const ranks = [
  { name: "Novice Hunter", xp: 0 },
  { name: "Elite Scholar", xp: 18000 },
  { name: "Champion Grasper", xp: 35000 },
  { name: "GOD", xp: 70000 },
];

export default function StudyBossBattle() {
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem("xp")) || 0);
  const [bossIndex, setBossIndex] = useState(() => parseInt(localStorage.getItem("bossIndex")) || 0);
  const [bossHp, setBossHp] = useState(() => parseInt(localStorage.getItem("bossHp")) || bosses[bossIndex].hp);
  const [rank, setRank] = useState(ranks[0]);
  const [gameComplete, setGameComplete] = useState(() => JSON.parse(localStorage.getItem("gameComplete")) || false);
  const [breakTime, setBreakTime] = useState(0);

  useEffect(() => {
    localStorage.setItem("xp", xp);
    localStorage.setItem("bossIndex", bossIndex);
    localStorage.setItem("bossHp", bossHp);
    localStorage.setItem("gameComplete", JSON.stringify(gameComplete));
  }, [xp, bossIndex, bossHp, gameComplete]);

  useEffect(() => {
    setRank(ranks.slice().reverse().find((r) => xp >= r.xp) || ranks[0]);
  }, [xp]);

  useEffect(() => {
    if (bossHp === 0 && bossIndex < bosses.length - 1) {
      setTimeout(() => {
        setBossIndex(prev => {
          const newIndex = prev + 1;
          setBossHp(bosses[newIndex].hp);
          return newIndex;
        });
        setXp(prevXp => prevXp + 800); 
      }, 1500);
    } else if (bossHp === 0 && bossIndex === bosses.length - 1) {
      setGameComplete(true);
    }
  }, [bossHp, bossIndex]);

  const handleMove = (move) => {
    if (xp >= move.cost && bossHp > 0) {
      setXp(prevXp => prevXp - move.cost);
      setBossHp(prevHp => Math.max(prevHp - move.damage, 0));
    }
  };

  const earnXp = (amount) => {
    setXp(prev => prev + amount);
  };

  if (gameComplete) {
    return (
      <div className="game-container">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-5xl font-bold mb-4 text-green-400">
          🎉 YOU'VE CONQUERED THE STUDY BATTLE! 🎉
        </motion.h1>
        <Button onClick={() => { 
          setXp(0);
          setBossIndex(0);
          setBossHp(bosses[0].hp);
          setGameComplete(false);
        }} className="mt-4 bg-blue-500 text-white hover:bg-blue-700">
          Restart Game
        </Button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <h1 className="text-5xl font-bold mb-4">⚔️ {bosses[bossIndex].name} ⚔️</h1>
      <Progress value={(bossHp / bosses[bossIndex].hp) * 100} />
      <p>Boss HP: {bossHp} / {bosses[bossIndex].hp}</p>
      <Progress value={(xp / ranks[ranks.length - 1].xp) * 100} />
      <p>XP: {xp}</p>
      <p>Rank: {rank.name} <GiRank3 /></p>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {xpSources.map((source) => (
          <Button key={source.name} onClick={() => earnXp(source.xp)}>
            {source.icon} {source.name} (+{source.xp} XP)
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {moves.map((move) => (
          <Button key={move.name} onClick={() => handleMove(move)}>
            ⚔️ {move.name} (-{move.cost} XP, {move.damage} DMG)
          </Button>
        ))}
      </div>
    </div>
  );
}