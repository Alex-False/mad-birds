import React, { useState } from "react";
import PhysicsEngine from "./PhysicsEngine";
import { Block, Bird, Floor, Pig } from "./bodies";

function Game() {
  const [bodies, setBodies] = useState([
    Bird({ x: -450, y: 700, radius: 20 }),
    Floor({ x: 500, y: 1150, width: 10000, height: 400 }),
    Floor({ x: 800, y: 500, width: 100, height: 40 }),
    Floor({ x: -825, y: 500, width: 40, height: 5000 }),
    Floor({ x: -850, y: -15, width: 10000, height: 40 }),
    Floor({ x: 1725, y: 500, width: 40, height: 5000 }),
    Block({ x: 600, y: 500, width: 80, height: 80 }),
    Block({ x: 700, y: 500, width: 80, height: 80 }),
    Block({ x: 800, y: 450, width: 50, height: 50 }),
    Block({ x: 300, y: 450, width: 80, height: 80 }),
    Block({ x: 300, y: 400, width: 80, height: 80 }),
    Pig({ x: 650, y: 500, radius: 20 }),
    Pig({ x: 800, y: 400, radius: 20 }),
    Pig({ x: 300, y: 380, radius: 20 }),
    Pig({ x: 650, y: 500, radius: 20 }),
  ]);

  const addPig = () => {
    setBodies([...bodies, Pig({ x: 1550, y: 500, radius: 20 })]);
  };

  const addBigBlock = () => {
    setBodies([...bodies, Block({ x: 1550, y: 500, width: 80, height: 80 })]);
  };

  const addSmallBlock = () => {
    setBodies([...bodies, Block({ x: 1550, y: 500, width: 50, height: 50 })]);
  };

  return (
    <>
      <PhysicsEngine bodies={bodies} />
      <div className="buttons-container">
        <button onClick={addPig}>Add Pig</button>
        <button onClick={addBigBlock}>Add Big Block</button>
        <button onClick={addSmallBlock}>Add Small Block</button>
      </div>
    </>
  );
}

export default Game;
