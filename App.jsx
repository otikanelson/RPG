// App.jsx - Main application component
import React, { useState, useEffect } from 'react';
import StartPage from './components/StartPage';
import GamePage from './components/GamePage';
import PopupManager from './components/PopupManager';
import { GameContextProvider } from './context/GameContext';

function App() {
  const [currentPage, setCurrentPage] = useState('start'); // 'start' or 'game'
  const [activePopup, setActivePopup] = useState(null); // null or popup id
  
  return (
    <GameContextProvider>
      <div className="h-screen w-screen overflow-hidden bg-black text-white">
        {currentPage === 'start' && (
          <StartPage onStartGame={() => setCurrentPage('game')} />
        )}
        
        {currentPage === 'game' && (
          <GamePage openPopup={(popupId) => setActivePopup(popupId)} />
        )}
        
        <PopupManager 
          activePopup={activePopup} 
          closePopup={() => setActivePopup(null)} 
        />
      </div>
    </GameContextProvider>
  );
}

export default App;