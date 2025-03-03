import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Progress } from "./components/ui/progress";

export default function StudyBossBattle() {
  const [xp, setXP] = useState(0);
  const [bossHP, setBossHP] = useState(100);
  const [breakTime, setBreakTime] = useState(0);
  const [showBreakOptions, setShowBreakOptions] = useState(false);

  useEffect(() => {
    let interval;
    if (breakTime > 0) {
      interval = setInterval(() => {
        setBreakTime((prev) => Math.max(prev - 1, 0));
        setXP((prevXP) => Math.max(prevXP - 1, 0)); // XP reduction during break
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breakTime]);

  const stopBreak = () => {
    setBreakTime(0);
    setXP((prevXP) => prevXP + 5); // Small XP bonus for stopping break early
  };

  const earnXP = (amount) => {
    if (breakTime === 0) {
      setXP((prevXP) => prevXP + amount);
      setBossHP((prevHP) => Math.max(prevHP - amount, 0));
    }
  };

  const startBreak = (duration) => {
    setBreakTime(duration);
    setShowBreakOptions(false);
  };

  const toggleBreakOptions = () => {
    setShowBreakOptions(!showBreakOptions);
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl w-full max-w-lg mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">⚔️ Study Boss Battle ⚔️</h1>
      <p className="text-lg">Boss HP: {bossHP}</p>
      <Progress value={(bossHP / 100) * 100} className="mb-4" />
      <p className="text-lg">XP: {xp}</p>
      <Progress value={(xp / 1000) * 100} className="mb-4" />

      <div className="mt-4">
        <h2 className="text-xl">Actions</h2>
        <Button onClick={() => earnXP(100)} className="xp-box mt-2">Gain 100 XP</Button>
      </div>

      <button className="break-button mt-4" onClick={toggleBreakOptions}>Take a Break</button>
      {showBreakOptions && (
        <div className="break-options">
          <Button onClick={() => startBreak(60)}>1 Hour Break</Button>
          <Button onClick={() => startBreak(120)}>2 Hour Break</Button>
          <Button onClick={() => startBreak(180)}>3 Hour Break</Button>
        </div>
      )}

      {breakTime > 0 && (
        <div className="mt-4 text-center">
          <p className="text-lg text-yellow-400">Break Time Left: {Math.floor(breakTime / 60)}h {breakTime % 60}m</p>
          <Button onClick={stopBreak} className="bg-red-500 text-white hover:bg-red-700 mt-2">Stop Break</Button>
        </div>
      )}
    </div>
  );
}
