import React, { useState, useEffect } from "react";
import { Progress } from "./components/ui/progress";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";

const ranks = [
  { name: "Novice Hunter", xp: 0, bg: "/images/novice-bg.jpg" },
  { name: "Elite Scholar", xp: 15000, bg: "/images/elite-bg.jpg" },
  { name: "Champion Grasper", xp: 30000, bg: "/images/champion-bg.jpg" },
  { name: "GOD", xp: 60000, bg: "/images/god-bg.jpg" },
];

const bosses = [
  { name: "INCURSION", hp: 5000, attack: 200, image: "/images/incursion.png" },
  { name: "ONSLAUGHT", hp: 15000, attack: 500, image: "/images/onslaught.png" },
  { name: "SIEGE", hp: 30000, attack: 1000, image: "/images/siege.png" },
  { name: "ANNIHILATION", hp: 60000, attack: 2000, image: "/images/annihilation.png" },
];

export default function StudyGame() {
  const [xp, setXp] = useState(0);
  const [rankIndex, setRankIndex] = useState(0);
  const [bossIndex, setBossIndex] = useState(0);
  const [bossHp, setBossHp] = useState(bosses[0].hp);
  const [breakTime, setBreakTime] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [specialSkill, setSpecialSkill] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        setBreakTime(!breakTime);
        setTimeLeft(breakTime ? 25 * 60 : 5 * 60);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, breakTime]);

  useEffect(() => {
    if (xp >= ranks[rankIndex + 1]?.xp) {
      setRankIndex(rankIndex + 1);
    }
  }, [xp]);

  useEffect(() => {
    if (bossHp <= 0 && bossIndex < bosses.length - 1) {
      setBossIndex(bossIndex + 1);
      setBossHp(bosses[bossIndex + 1].hp);
    }
  }, [bossHp]);

  useEffect(() => {
    if (xp >= 10000) {
      setSpecialSkill(true);
    }
  }, [xp]);

  const earnXp = (amount) => {
    let totalXp = specialSkill ? amount * 1.5 : amount;
    setXp((prevXp) => Math.max(0, prevXp + totalXp - bosses[bossIndex].attack));
    setBossHp((prevBossHp) => Math.max(0, prevBossHp - totalXp));
  };

  return (
    <div className="game-container" style={{ backgroundImage: `url(${ranks[rankIndex].bg})` }}>
      <h1>{ranks[rankIndex].name}</h1>
      <Progress value={(xp / ranks[ranks.length - 1].xp) * 100} />
      <Card>
        <CardContent>
          <h2>Boss: {bosses[bossIndex].name}</h2>
          <img src={bosses[bossIndex].image} alt={bosses[bossIndex].name} className="boss-image" />
          <Progress value={(bossHp / bosses[bossIndex].hp) * 100} />
          <p>Boss Attack: {bosses[bossIndex].attack} XP</p>
        </CardContent>
      </Card>
      <Button onClick={() => earnXp(500)}>Earn XP</Button>
      {specialSkill && <p>Special Skill Active: XP Boost!</p>}
      <div className="timer">
        {breakTime ? "Break Time!" : "Study Time!"} {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
      </div>
    </div>
  );
}
