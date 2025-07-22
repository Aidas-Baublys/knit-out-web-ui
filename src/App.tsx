// File: src/App.tsx
import React, { useEffect, useState } from 'react';
import CarpetGrid from './components/CarpetGrid';
import BobbinGrid from './components/BobbinGrid';
import levelData from './levels/level_11d0e7e6-3745-4525-ac94-c54a8a98d881.json';

import './App.css';

export type Level = {
  level_id: number;
  color_columns: number[][];
  bobbin_grid: number[][];
};

export type ActiveSlot = { color: number; collected: number } | null;

export type GameState = {
  carpets: number[][];
  bobbins: number[][];
  activeSlots: ActiveSlot[]; // 5 active slots
  usedBobbins: Set<string>; // track clicked bobbins
  recentCollections: Set<string>; // key = `${colIndex}`
  status: 'playing' | 'won' | 'lost';
};

const App: React.FC = () => {
  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    const initState: GameState = {
      carpets: levelData.color_columns.map(col => [...col]),
      bobbins: levelData.bobbin_grid,
      activeSlots: [null, null, null, null, null],
      usedBobbins: new Set(),
      recentCollections: new Set(),
      status: 'playing',
    };
    setState(initState);
  }, []);

  const processActiveSlotsLoop = (carpets: number[][], slots: ActiveSlot[]): [number[][], ActiveSlot[]] => {
    let updatedCarpets = carpets.map(col => [...col]);
    let updatedSlots = [...slots];
    let changed: boolean;

    do {
      changed = false;

      const newCarpets = updatedCarpets.map(col => [...col]);
      const newSlots: ActiveSlot[] = updatedSlots.map(slot => {
        if (!slot) return null;
        let collected = slot.collected;

        for (let i = 0; i < newCarpets.length; i++) {
          const col = newCarpets[i];
          if (col[0] === slot.color && collected < 3) {
            col.shift();
            collected++;
            changed = true;
          }
        }

        return collected >= 3 ? null : { color: slot.color, collected };
      });

      updatedCarpets = newCarpets;
      updatedSlots = newSlots;
    } while (changed);

    return [updatedCarpets, updatedSlots];
  };

  const handleBobbinClick = (row: number, col: number) => {
    if (!state || state.status !== 'playing') return;
    const key = `${row}-${col}`;
    if (state.usedBobbins.has(key)) return;

    const color = state.bobbins[row][col];
    if (color === -1) return;

    const slotIndex = state.activeSlots.findIndex(s => s === null);
    if (slotIndex === -1) {
      alert('No available slots!');
      return;
    }

    const updatedUsed = new Set(state.usedBobbins);
    updatedUsed.add(key);

    const newSlots: ActiveSlot[] = [...state.activeSlots];
    newSlots[slotIndex] = { color, collected: 0 };

    // Process active slots after placing new bobbin
    const [updatedCarpets, updatedSlots] = processActiveSlotsLoop(state.carpets, newSlots);

    const allClear = updatedCarpets.every(col => col.length === 0);
    const lost = updatedSlots.every(s => s !== null) && !updatedCarpets.some(col => col.length > 0);

    setState({
      ...state,
      carpets: updatedCarpets,
      activeSlots: updatedSlots,
      usedBobbins: updatedUsed,
      status: allClear ? 'won' : lost ? 'lost' : 'playing',
    });
  };

  if (!state) return <div className='loading'>Loading...</div>;

  return (
    <div className='app'>
      <h1>KnitOut Playtest</h1>
      <CarpetGrid carpets={state.carpets} />
      <div className='active-slots'>
        {state.activeSlots.map((slot, i) => (
          <div key={i} className={`slot color-${slot?.color ?? -1}`}>
            {slot ? `${slot.color} (${slot.collected})` : ''}
          </div>
        ))}
      </div>
      <BobbinGrid bobbins={state.bobbins} onClick={handleBobbinClick} used={state.usedBobbins} />
      {state.status !== 'playing' && <div className='status'>{state.status.toUpperCase()} 🎉</div>}
    </div>
  );
};

export default App;
