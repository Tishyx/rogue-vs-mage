import type { FC } from 'react';
import './styles.css';

const App: FC = () => {
  return (
    <>
      <canvas id="gameCanvas"></canvas>
      <div id="ui">
        <div className="hud-grid">
          <div className="hud-column hud-column-left">
            <div id="playerHealth" className="bar-card">
              <div className="bar-header">
                <span>Rogue</span>
                <span id="playerHpText">100/100</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill health-bar" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div id="playerEnergy" className="bar-card">
              <div className="bar-header">
                <span>Energy</span>
                <span id="playerEnergyText">100/100</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill energy-bar" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div id="comboPoints"></div>

            <div id="playerBuffs"></div>
          </div>

          <div className="hud-column hud-column-right">
            <div id="enemyHealth" className="bar-card">
              <div className="bar-header">
                <span>Frost Mage</span>
                <span id="enemyHpText">100/100</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill health-bar" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div id="enemyMana" className="bar-card">
              <div className="bar-header">
                <span>Mana</span>
                <span id="enemyManaText">100/100</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill mana-bar" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div id="enemyCastBar">
              <div className="cast-progress"></div>
              <div className="cast-text">Ready</div>
            </div>
          </div>
        </div>

        <div id="targetIndicator">Target: Frost Mage</div>

        <div id="abilities"></div>

        <div className="hud-footer">
          <div id="combatLog"></div>

          <div id="controls">
            <div className="control-item"><strong>Movement:</strong> WASD</div>
            <div className="control-item"><strong>Camera:</strong> Mouse</div>
            <div className="control-item"><strong>Jump:</strong> Space</div>
            <div className="control-item"><strong>Abilities:</strong> 1-7</div>
            <div className="control-item"><strong>Target:</strong> Tab</div>
            <div className="control-item">
              <label htmlFor="playerSkinSelect"><strong>Rogue Skin:</strong></label>
              <select id="playerSkinSelect"></select>
            </div>
            <div className="control-item">
              <label htmlFor="enemySkinSelect"><strong>Mage Skin:</strong></label>
              <select id="enemySkinSelect"></select>
            </div>
          </div>
        </div>

        <div id="overlayContainer">
          <div className="overlay-content">
            <div className="overlay-title" id="overlayTitle">Game Paused</div>
            <div className="overlay-subtitle" id="overlaySubtitle">Press Escape to resume.</div>
            <div className="overlay-buttons">
              <button type="button" id="resumeButton" className="overlay-button secondary">
                Resume Duel
              </button>
              <button type="button" id="restartButton" className="overlay-button">
                Restart Duel
              </button>
            </div>
          </div>
        </div>

        <div id="gameStatus"></div>
      </div>
    </>
  );
};

export default App;
