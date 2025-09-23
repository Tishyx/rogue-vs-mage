// Game state
const gameState = {
    player: {
        position: new THREE.Vector3(0, 1, 10),
        rotation: 0,
        velocity: new THREE.Vector3(0, 0, 0),
        health: 100,
        maxHealth: 100,
        energy: 100,
        maxEnergy: 100,
        comboPoints: 0,
        maxComboPoints: 5,
        isStealthed: false,
        isRooted: false,
        rootDuration: 0,
        buffs: new Map(),
        inCombat: false,
        appearanceSet: 'stealth-leather',
        availableAppearances: ['stealth-leather', 'crimson-assassin'],
        abilities: [
            {
                name: 'Sinister Strike',
                label: 'Sinister',
                key: '1',
                icon: '⚔️',
                description: 'A vicious melee attack dealing moderate damage to the target.',
                cost: 40,
                damage: 25,
                buildsCombo: true,
                comboPointsGenerated: 1,
                cooldown: 0,
                maxCooldown: 0,
                cooldownText: 'No cooldown',
                visualEffect: {
                    type: 'directional-slash',
                    color: 0xff5a36,
                    particleCount: 18,
                    startSize: 1.4,
                    endSize: 0.35
                }
            },
            {
                name: 'Backstab',
                label: 'Backstab',
                key: '2',
                icon: '🗡️',
                description: 'Strike from the shadows for massive damage when positioned behind the enemy.',
                cost: 60,
                damage: 50,
                buildsCombo: true,
                comboPointsGenerated: 1,
                cooldown: 0,
                maxCooldown: 4,
                requiresStealth: false,
                requiresBehind: true,
                cooldownText: 'Cooldown: 4s',
                visualEffect: {
                    type: 'directional-slash',
                    color: 0xffe066,
                    particleCount: 22,
                    startSize: 1.6,
                    endSize: 0.25,
                    swirl: true
                }
            },
            {
                name: 'Stealth',
                label: 'Stealth',
                key: '3',
                icon: '👤',
                description: 'Slip into the shadows for 10 seconds, allowing you to open with powerful attacks.',
                cost: 0,
                cooldown: 0,
                maxCooldown: 10,
                duration: 10,
                cooldownText: 'Cooldown: 10s',
                visualEffect: {
                    type: 'stealth-entry',
                    color: 0x4c2a6a,
                    particleCount: 26,
                    startSize: 2.4,
                    endSize: 0.1
                }
            },
            {
                name: 'Sprint',
                label: 'Sprint',
                key: '4',
                icon: '💨',
                description: 'Boost your movement speed dramatically for a short duration.',
                cost: 0,
                cooldown: 0,
                maxCooldown: 60,
                duration: 8,
                cooldownText: 'Cooldown: 60s',
                visualEffect: {
                    type: 'speed-trail',
                    color: 0xffc14d,
                    particleCount: 14,
                    startSize: 1.2,
                    endSize: 0.2
                }
            },
            {
                name: 'Evasion',
                label: 'Evasion',
                key: '5',
                icon: '🌀',
                description: 'Dodge incoming attacks, greatly increasing your chance to avoid damage.',
                cost: 0,
                cooldown: 0,
                maxCooldown: 180,
                duration: 5,
                cooldownText: 'Cooldown: 180s',
                visualEffect: {
                    type: 'defensive-shield',
                    color: 0x7dd0ff,
                    particleCount: 16,
                    startSize: 1.8,
                    endSize: 0.6
                }
            },
            {
                name: 'Ambush',
                label: 'Ambush',
                key: '6',
                icon: '☠️',
                description: 'Open from stealth with a brutal strike that deals heavy damage.',
                cost: 60,
                damage: 70,
                buildsCombo: true,
                comboPointsGenerated: 2,
                cooldown: 0,
                maxCooldown: 0,
                requiresStealth: true,
                cooldownText: 'No cooldown',
                visualEffect: {
                    type: 'shadow-strike',
                    color: 0x8f5fff,
                    particleCount: 28,
                    startSize: 1.7,
                    endSize: 0.3
                }
            },
            {
                name: 'Eviscerate',
                label: 'Eviscerate',
                key: '7',
                icon: '💥',
                description: 'A brutal finishing move that consumes combo points for massive damage.',
                cost: 35,
                damage: 20,
                damagePerCombo: 18,
                finisher: true,
                cooldown: 0,
                maxCooldown: 0,
                cooldownText: 'No cooldown',
                visualEffect: {
                    type: 'finisher',
                    color: 0xff3b2f,
                    particleCount: 32,
                    startSize: 2.1,
                    endSize: 0.4
                }
            }
        ]
    },
    enemies: [
        {
            name: 'Frost Mage',
            position: new THREE.Vector3(0, 1, -10),
            rotation: 0,
            velocity: new THREE.Vector3(0, 0, 0),
            health: 100,
            maxHealth: 100,
            mana: 100,
            maxMana: 100,
            isCasting: false,
            castTime: 0,
            castDuration: 0,
            castCost: 0,
            currentCast: null,
            isRooted: false,
            rootDuration: 0,
            appearanceSet: 'frost-regalia',
            availableAppearances: ['frost-regalia', 'arcane-warden'],
            abilities: [
                {
                    name: 'Frostbolt',
                    cost: 30,
                    damage: 35,
                    castTime: 2.5,
                    cooldown: 0,
                    visualEffect: {
                        type: 'frost-cast',
                        color: 0x7dd0ff,
                        particleCount: 18
                    }
                },
                {
                    name: 'Frost Nova',
                    cost: 40,
                    damage: 15,
                    cooldown: 0,
                    maxCooldown: 20,
                    isInstant: true,
                    visualEffect: {
                        type: 'frost-field',
                        color: 0xb3ecff,
                        particleCount: 24
                    }
                },
                {
                    name: 'Blink',
                    cost: 20,
                    cooldown: 0,
                    maxCooldown: 15,
                    isInstant: true,
                    visualEffect: {
                        type: 'blink',
                        color: 0xcbe5ff,
                        particleCount: 20
                    }
                },
                {
                    name: 'Ice Barrier',
                    cost: 50,
                    cooldown: 0,
                    maxCooldown: 30,
                    shield: 40,
                    isInstant: true,
                    visualEffect: {
                        type: 'defensive-shield',
                        color: 0xa7f0ff,
                        particleCount: 18,
                        startSize: 2.4,
                        endSize: 1.0
                    }
                },
                {
                    name: 'Cone of Cold',
                    cost: 35,
                    damage: 25,
                    cooldown: 0,
                    maxCooldown: 8,
                    isInstant: true,
                    visualEffect: {
                        type: 'frost-cone',
                        color: 0x9cdcff,
                        particleCount: 28
                    }
                },
                {
                    name: 'Arcane Missiles',
                    cost: 45,
                    damage: 14,
                    missiles: 3,
                    cooldown: 0,
                    maxCooldown: 12,
                    isInstant: true,
                    visualEffect: {
                        type: 'arcane-missiles',
                        color: 0xb695ff,
                        particleCount: 3,
                        startSize: 1.2,
                        endSize: 0.3,
                        missiles: 3
                    }
                }
            ],
            shield: 0,
            aiState: 'aggressive',
            lastAbilityTime: 0,
            awareness: 1,
            lastKnownPlayerPos: null,
            detectCooldown: 0,
            searchTimer: 0,
            patrolAngle: 0
        }
    ],
    currentTarget: 0,
    camera: {
        pitch: 0,
        yaw: 0,
        distance: 15,
        targetDistance: 15,
        minDistance: 8,
        maxDistance: 25,
        zoomSpeed: 5,
        height: 5,
        targetHeight: 5,
        heightRatio: 5 / 15,
        defaultDistance: 15
    },
    input: {
        keys: {},
        mouseX: 0,
        mouseY: 0
    },
    gameOver: false,
    isPaused: false,
    outcome: null,
    overlayMessage: null,
    particles: []
};

const initialPlayerState = {
    position: gameState.player.position.clone(),
    rotation: gameState.player.rotation,
    health: gameState.player.maxHealth,
    maxHealth: gameState.player.maxHealth,
    energy: gameState.player.maxEnergy,
    maxEnergy: gameState.player.maxEnergy,
    comboPoints: 0,
    isStealthed: false,
    isRooted: false,
    rootDuration: 0,
    inCombat: false,
    appearanceSet: gameState.player.appearanceSet
};

const initialEnemyStates = gameState.enemies.map(enemy => ({
    position: enemy.position.clone(),
    rotation: enemy.rotation,
    maxHealth: enemy.maxHealth,
    maxMana: enemy.maxMana,
    aiState: enemy.aiState,
    awareness: enemy.awareness,
    detectCooldown: enemy.detectCooldown,
    searchTimer: enemy.searchTimer,
    patrolAngle: enemy.patrolAngle,
    appearanceSet: enemy.appearanceSet
}));

const initialCameraState = {
    pitch: gameState.camera.pitch,
    yaw: gameState.camera.yaw,
    distance: gameState.camera.distance,
    targetDistance: gameState.camera.targetDistance,
    minDistance: gameState.camera.minDistance,
    maxDistance: gameState.camera.maxDistance,
    zoomSpeed: gameState.camera.zoomSpeed,
    height: gameState.camera.height,
    targetHeight: gameState.camera.targetHeight,
    heightRatio: gameState.camera.heightRatio,
    defaultDistance: gameState.camera.defaultDistance
};

function getCurrentEnemy() {
    return gameState.enemies[gameState.currentTarget] || null;
}

function getEnemyName(enemy = getCurrentEnemy()) {
    return enemy?.name || 'Enemy';
}

function updateTargetIndicator() {
    const targetIndicator = document.getElementById('targetIndicator');
    if (!targetIndicator) return;

    const enemy = getCurrentEnemy();
    if (enemy && enemy.health > 0) {
        targetIndicator.textContent = `Target: ${getEnemyName(enemy)}`;
    } else {
        targetIndicator.textContent = 'No Target';
    }
}

function selectNextTarget() {
    if (gameState.enemies.length === 0) {
        updateTargetIndicator();
        return;
    }

    const previousEnemy = getCurrentEnemy();
    let nextIndex = gameState.currentTarget;
    for (let i = 0; i < gameState.enemies.length; i++) {
        nextIndex = (nextIndex + 1) % gameState.enemies.length;
        const potentialTarget = gameState.enemies[nextIndex];
        if (potentialTarget && potentialTarget.health > 0) {
            if (previousEnemy && previousEnemy !== potentialTarget) {
                interruptEnemyCast('Target Changed', previousEnemy);
            }
            gameState.currentTarget = nextIndex;
            applyEnemyAppearance(potentialTarget);
            updateEnemySkinOptions(potentialTarget);
            updateSkinSelectors();
            updateTargetIndicator();
            return;
        }
    }

    if (previousEnemy && previousEnemy.health <= 0) {
        interruptEnemyCast('Target Changed', previousEnemy);
    }

    updateTargetIndicator();
}

function setPlayerBuff(name, { duration = 0, icon = '', type = 'buff' } = {}) {
    gameState.player.buffs.set(name, {
        duration,
        remaining: duration,
        icon,
        type
    });
}

function removePlayerBuff(name) {
    if (!gameState.player.buffs.has(name)) {
        return;
    }
    gameState.player.buffs.delete(name);
    if (name === 'stealth') {
        gameState.player.isStealthed = false;
        setPlayerAppearanceOpacity(1, false);
    }
}

const enemyCastBarUI = {
    container: document.getElementById('enemyCastBar'),
    progress: document.querySelector('#enemyCastBar .cast-progress'),
    text: document.querySelector('#enemyCastBar .cast-text'),
    hideTimeout: null
};

const activeTimeouts = new Set();

function scheduleTimeout(callback, delay) {
    const timeoutId = setTimeout(() => {
        activeTimeouts.delete(timeoutId);
        callback();
    }, delay);
    activeTimeouts.add(timeoutId);
    return timeoutId;
}

function cancelTrackedTimeout(timeoutId) {
    if (!timeoutId && timeoutId !== 0) return;
    clearTimeout(timeoutId);
    activeTimeouts.delete(timeoutId);
}

function clearAllTrackedTimeouts() {
    activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    activeTimeouts.clear();
}

const overlayUI = {
    container: document.getElementById('overlayContainer'),
    title: document.getElementById('overlayTitle'),
    subtitle: document.getElementById('overlaySubtitle'),
    restartButton: document.getElementById('restartButton'),
    resumeButton: document.getElementById('resumeButton')
};

function setOverlayActive(active) {
    if (!overlayUI.container) return;
    if (active) {
        if (!overlayUI.container.classList.contains('active')) {
            overlayUI.container.classList.add('active');
        }
        if (document.pointerLockElement === document.body) {
            document.exitPointerLock();
        }
    } else {
        overlayUI.container.classList.remove('active');
    }
}

function updateOverlay(override) {
    if (!overlayUI.container) return;

    let state = override?.state || null;
    if (!state) {
        if (gameState.gameOver) {
            state = gameState.outcome || 'defeat';
        } else if (gameState.isPaused) {
            state = 'paused';
        }
    }

    if (!state) {
        overlayUI.container.classList.remove('victory', 'defeat', 'paused');
        if (overlayUI.subtitle) {
            overlayUI.subtitle.textContent = '';
        }
        setOverlayActive(false);
        return;
    }

    overlayUI.container.classList.remove('victory', 'defeat', 'paused');
    overlayUI.container.classList.add(state);

    let title = override?.title;
    let subtitle = override?.subtitle;
    let showRestart = override?.showRestart;
    let showResume = override?.showResume;

    if (!override) {
        if (state === 'paused') {
            title = 'Game Paused';
            subtitle = 'Press Escape or click resume to continue.';
            showRestart = true;
            showResume = true;
        } else {
            const message = gameState.overlayMessage;
            if (message) {
                title = message.title;
                subtitle = message.subtitle;
            } else if (state === 'victory') {
                title = 'Victory!';
                subtitle = 'All enemies defeated. Click restart to duel again.';
            } else if (state === 'defeat') {
                title = 'Defeat';
                subtitle = 'You were defeated. Click restart to try again.';
            }
            showRestart = true;
            showResume = false;
        }
    } else {
        if (typeof showRestart === 'undefined') {
            showRestart = true;
        }
        if (typeof showResume === 'undefined') {
            showResume = state === 'paused';
        }
    }

    if (overlayUI.title) {
        overlayUI.title.textContent = title || '';
    }
    if (overlayUI.subtitle) {
        overlayUI.subtitle.textContent = subtitle || '';
    }

    if (overlayUI.restartButton) {
        overlayUI.restartButton.style.display = showRestart ? 'block' : 'none';
    }
    if (overlayUI.resumeButton) {
        overlayUI.resumeButton.style.display = showResume ? 'block' : 'none';
    }

    setOverlayActive(true);
}

if (overlayUI.restartButton) {
    overlayUI.restartButton.addEventListener('click', (event) => {
        event.preventDefault();
        resetGameState();
    });
}

if (overlayUI.resumeButton) {
    overlayUI.resumeButton.addEventListener('click', (event) => {
        event.preventDefault();
        togglePause(false);
    });
}

function togglePause(forceState) {
    if (gameState.gameOver) {
        return;
    }

    const desiredState = typeof forceState === 'boolean' ? forceState : !gameState.isPaused;
    if (gameState.isPaused === desiredState) {
        updateOverlay();
        return;
    }

    gameState.isPaused = desiredState;

    if (gameState.isPaused) {
        gameState.input.keys = {};
    } else {
        lastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    }

    updateUI();

    const abilityElement = document.querySelector(`#abilities .ability[data-ability="${index}"]`);
    if (abilityElement) {
        abilityElement.classList.remove('activated');
        void abilityElement.offsetWidth;
        abilityElement.classList.add('activated');
        abilityElement.addEventListener('animationend', () => {
            abilityElement.classList.remove('activated');
        }, { once: true });
    }
}
function showEnemyCastBar(spellName, duration) {
    if (!enemyCastBarUI.container) return;
    if (enemyCastBarUI.hideTimeout) {
        cancelTrackedTimeout(enemyCastBarUI.hideTimeout);
        enemyCastBarUI.hideTimeout = null;
    }

    enemyCastBarUI.container.classList.add('active');
    enemyCastBarUI.container.classList.remove('interrupted');
    enemyCastBarUI.progress.style.width = '0%';

    const durationText = duration > 0 ? ` (${duration.toFixed(1)}s)` : '';
    enemyCastBarUI.text.textContent = `${spellName}${durationText}`;
}

function updateEnemyCastBarProgress(remainingTime) {
    if (!enemyCastBarUI.container) return;
    const enemy = getCurrentEnemy();
    if (!enemy) return;

    const duration = enemy.castDuration;
    if (duration <= 0) return;

    const clampedRemaining = Math.max(0, remainingTime);
    const percent = Math.min(1, Math.max(0, (duration - clampedRemaining) / duration));
    enemyCastBarUI.progress.style.width = `${(percent * 100).toFixed(2)}%`;

    const secondsText = clampedRemaining.toFixed(1);
    enemyCastBarUI.text.textContent = `${enemy.currentCast} (${secondsText}s)`;
}

function hideEnemyCastBar(interrupted = false, message = 'Interrupted') {
    if (!enemyCastBarUI.container) return;
    if (enemyCastBarUI.hideTimeout) {
        cancelTrackedTimeout(enemyCastBarUI.hideTimeout);
        enemyCastBarUI.hideTimeout = null;
    }

    if (interrupted) {
        enemyCastBarUI.container.classList.add('active');
        enemyCastBarUI.container.classList.add('interrupted');
        enemyCastBarUI.progress.style.width = '100%';
        enemyCastBarUI.text.textContent = message;

        enemyCastBarUI.hideTimeout = scheduleTimeout(() => {
            enemyCastBarUI.container.classList.remove('active', 'interrupted');
            enemyCastBarUI.progress.style.width = '0%';
            enemyCastBarUI.text.textContent = 'Ready';
            enemyCastBarUI.hideTimeout = null;
        }, 600);
    } else {
        enemyCastBarUI.container.classList.remove('active', 'interrupted');
        enemyCastBarUI.progress.style.width = '0%';
        enemyCastBarUI.text.textContent = 'Ready';
    }
}

function interruptEnemyCast(reason, enemyOverride = getCurrentEnemy()) {
    const enemy = enemyOverride;
    if (!enemy || !enemy.isCasting) return;

    const interruptedSpell = enemy.currentCast;
    enemy.isCasting = false;
    enemy.castTime = 0;
    enemy.castDuration = 0;
    enemy.castCost = 0;
    enemy.currentCast = null;

    const interruptionText = reason ? `Interrupted (${reason})` : 'Interrupted';
    hideEnemyCastBar(true, interruptionText);

    if (interruptedSpell) {
        const logReason = reason ? ` (${reason})` : '';
        addCombatMessage(`${getEnemyName(enemy)}'s ${interruptedSpell} was interrupted${logReason}!`, 'ability-use');
    }
}

function renderAbilities() {
    const abilitiesContainer = document.getElementById('abilities');
    const abilityHtml = gameState.player.abilities.map((ability, index) => `
        <div class="ability" data-ability="${index}">
            <span class="ability-key">${ability.key || index + 1}</span>
            <div class="ability-slot">
                <span class="ability-icon">${ability.icon}</span>
            </div>
            <span class="ability-name">${ability.label || ability.name}</span>
            <div class="ability-tooltip">
                <div class="ability-tooltip-title">${ability.name}</div>
                <div>${ability.description}</div>
                <div class="ability-tooltip-cooldown">${ability.cooldownText}</div>
                <div class="ability-tooltip-remaining">Ready</div>
            </div>
        </div>
    `).join('');
    abilitiesContainer.innerHTML = abilityHtml;
}

function initializeAbilityUI() {
    renderAbilities();

    const abilityElements = document.querySelectorAll('#abilities .ability');
    abilityElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            const tooltip = element.querySelector('.ability-tooltip');
            if (tooltip) {
                tooltip.style.display = 'block';
            }
        });

        element.addEventListener('mouseleave', () => {
            const tooltip = element.querySelector('.ability-tooltip');
            if (tooltip) {
                tooltip.style.display = 'none';
            }
        });
    });

    bindAbilityClickHandlers();
}

function initializeAppearanceSelectors() {
    const playerSelect = document.getElementById('playerSkinSelect');
    if (playerSelect) {
        updatePlayerSkinOptions();
        playerSelect.addEventListener('change', event => {
            const value = event.target.value;
            if (!value) {
                return;
            }
            const success = gameState.setAppearance('player', value);
            if (!success) {
                playerSelect.value = gameState.player.appearanceSet;
            }
        });
    }

    const enemySelect = document.getElementById('enemySkinSelect');
    if (enemySelect) {
        updateEnemySkinOptions();
        enemySelect.addEventListener('change', event => {
            const value = event.target.value;
            if (!value) {
                return;
            }
            const currentEnemy = getCurrentEnemy();
            const target = currentEnemy || 0;
            const success = gameState.setAppearance(target, value);
            if (!success) {
                const fallback = currentEnemy?.appearanceSet || gameState.enemies[0]?.appearanceSet || value;
                enemySelect.value = fallback;
            }
        });
    }

    updateSkinSelectors();
}

// Initialize Three.js
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x1c1f2a, 0.015);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const composer = new THREE.EffectComposer(renderer);
composer.setPixelRatio(window.devicePixelRatio || 1);
composer.setSize(window.innerWidth, window.innerHeight);

const renderPass = new THREE.RenderPass(scene, camera);
composer.addPass(renderPass);

const ssaoPass = new THREE.SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
ssaoPass.kernelRadius = 14;
ssaoPass.minDistance = 0.0008;
ssaoPass.maxDistance = 0.18;
ssaoPass.output = THREE.SSAOPass.OUTPUT.Default;
composer.addPass(ssaoPass);

const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.45, 0.35, 0.9);
bloomPass.threshold = 0.82;
bloomPass.strength = 0.4;
bloomPass.radius = 0.55;
composer.addPass(bloomPass);

const gammaPass = new THREE.ShaderPass(THREE.GammaCorrectionShader);
gammaPass.renderToScreen = true;
composer.addPass(gammaPass);

const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin('anonymous');
const imageLoader = new THREE.ImageLoader();
imageLoader.setCrossOrigin('anonymous');
const gltfLoader = new THREE.GLTFLoader();

const clothingTextureCache = new Map();

const environmentEffectState = {
    group: new THREE.Group(),
    dustSystems: [],
    volumetricLights: [],
    typeMap: {},
    initialized: false
};
scene.add(environmentEffectState.group);

function loadTextureWithOptions(url, options = {}) {
    if (!url) {
        return null;
    }

    if (clothingTextureCache.has(url)) {
        return clothingTextureCache.get(url);
    }

    const texture = textureLoader.load(url, loadedTexture => {
        if (options.encoding === 'sRGB' || options.encoding === THREE.sRGBEncoding) {
            loadedTexture.encoding = THREE.sRGBEncoding;
        }
        if (options.repeat) {
            loadedTexture.repeat.set(options.repeat[0] ?? 1, options.repeat[1] ?? 1);
        }
        if (options.wrapS) {
            loadedTexture.wrapS = options.wrapS;
        }
        if (options.wrapT) {
            loadedTexture.wrapT = options.wrapT;
        }
        if (options.flipY === false) {
            loadedTexture.flipY = false;
        }
    });

    if (options.encoding === 'sRGB' || options.encoding === THREE.sRGBEncoding) {
        texture.encoding = THREE.sRGBEncoding;
    }
    if (options.repeat) {
        texture.wrapS = texture.wrapS ?? THREE.RepeatWrapping;
        texture.wrapT = texture.wrapT ?? THREE.RepeatWrapping;
        texture.repeat.set(options.repeat[0] ?? 1, options.repeat[1] ?? 1);
    }
    if (options.wrapS) {
        texture.wrapS = options.wrapS;
    }
    if (options.wrapT) {
        texture.wrapT = options.wrapT;
    }
    if (options.flipY === false) {
        texture.flipY = false;
    }

    clothingTextureCache.set(url, texture);
    return texture;
}

const environmentTextures = {
    terrain: {
        albedo: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/4k/rockyground06/rockyground06_diff_4k.jpg',
        normal: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/4k/rockyground06/rockyground06_nor_gl_4k.jpg',
        roughness: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/4k/rockyground06/rockyground06_rough_4k.jpg',
        height: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/4k/rockyground06/rockyground06_disp_4k.jpg'
    },
    rocks: {
        albedo: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/rock_wall_03/rock_wall_03_diff_2k.jpg',
        normal: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/rock_wall_03/rock_wall_03_nor_gl_2k.jpg',
        roughness: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/rock_wall_03/rock_wall_03_rough_2k.jpg'
    }
};

let terrainHeightSampler = null;

function applyHeightMapToGeometry(geometry, url, heightScale = 6) {
    return new Promise(resolve => {
        imageLoader.load(url, image => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

            const position = geometry.attributes.position;
            const widthSegments = geometry.parameters.widthSegments;
            const heightSegments = geometry.parameters.heightSegments;
            const vertexRowLength = widthSegments + 1;

            for (let y = 0; y <= heightSegments; y++) {
                for (let x = 0; x <= widthSegments; x++) {
                    const u = x / widthSegments;
                    const v = y / heightSegments;
                    const ix = Math.floor(u * (canvas.width - 1));
                    const iy = Math.floor((1 - v) * (canvas.height - 1));
                    const pixelIndex = (iy * canvas.width + ix) * 4;
                    const heightValue = data[pixelIndex] / 255;
                    const vertexIndex = y * vertexRowLength + x;
                    position.setZ(vertexIndex, heightValue * heightScale);
                }
            }

            position.needsUpdate = true;
            geometry.computeVertexNormals();

            const sampler = (worldX, worldZ) => {
                const width = geometry.parameters.width;
                const height = geometry.parameters.height;
                if (!width || !height) {
                    return 0;
                }

                const normalizedX = THREE.MathUtils.clamp(worldX / width + 0.5, 0, 1);
                const normalizedZ = THREE.MathUtils.clamp(worldZ / height + 0.5, 0, 1);
                const sampleX = Math.floor(normalizedX * (canvas.width - 1));
                const sampleY = Math.floor((1 - normalizedZ) * (canvas.height - 1));
                const sampleIndex = (sampleY * canvas.width + sampleX) * 4;
                return (data[sampleIndex] / 255) * heightScale;
            };

            resolve(sampler);
        }, undefined, () => resolve(null));
    });
}

function sampleTerrainHeight(x, z) {
    return terrainHeightSampler ? terrainHeightSampler(x, z) : 0;
}

const instancingHelper = new THREE.Object3D();

function scatterInstancedMeshes({
    geometry,
    material,
    count,
    minRadius,
    maxRadius,
    minScale = 1,
    maxScale = 1.5,
    yOffset = 0
}) {
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = THREE.MathUtils.lerp(minRadius, maxRadius, Math.random());
        const scale = THREE.MathUtils.lerp(minScale, maxScale, Math.random());
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = sampleTerrainHeight(x, z) + yOffset;

        instancingHelper.position.set(x, y, z);
        instancingHelper.rotation.set(0, Math.random() * Math.PI * 2, 0);
        instancingHelper.scale.setScalar(scale);
        instancingHelper.updateMatrix();
        mesh.setMatrixAt(i, instancingHelper.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    scene.add(mesh);
    return mesh;
}

function createSoftParticleTexture(size = 128) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(size / 2, size / 2, size * 0.05, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.35)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
}

function createEnvironmentEffects() {
    if (environmentEffectState.initialized) {
        return environmentEffectState;
    }

    environmentEffectState.group.name = 'environmentEffects';
    environmentEffectState.initialized = true;
    environmentEffectState.dustSystems.length = 0;
    environmentEffectState.volumetricLights.length = 0;

    const particleTexture = createSoftParticleTexture();

    const dustLayers = [
        {
            count: 320,
            radius: 34,
            minY: 0.25,
            height: 3.8,
            speedRange: [0.6, 1.05],
            size: 0.55,
            color: 0xc7bba2,
            opacity: 0.42
        },
        {
            count: 220,
            radius: 30,
            minY: 2.6,
            height: 6.4,
            speedRange: [0.28, 0.55],
            size: 0.72,
            color: 0xa2b1c6,
            opacity: 0.38
        },
        {
            count: 160,
            radius: 24,
            minY: 5.5,
            height: 9.5,
            speedRange: [0.14, 0.34],
            size: 0.95,
            color: 0x8b7cae,
            opacity: 0.32
        }
    ];

    dustLayers.forEach((layer, index) => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(layer.count * 3);
        const speeds = new Float32Array(layer.count);

        for (let i = 0; i < layer.count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * layer.radius;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = layer.minY + Math.random() * layer.height;

            const idx = i * 3;
            positions[idx] = x;
            positions[idx + 1] = y;
            positions[idx + 2] = z;

            speeds[i] = THREE.MathUtils.lerp(layer.speedRange[0], layer.speedRange[1], Math.random());
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.computeBoundingSphere();

        const material = new THREE.PointsMaterial({
            size: layer.size,
            transparent: true,
            opacity: layer.opacity,
            map: particleTexture,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            color: new THREE.Color(layer.color)
        });

        const points = new THREE.Points(geometry, material);
        points.renderOrder = -10 + index;
        points.frustumCulled = true;
        points.matrixAutoUpdate = false;
        points.updateMatrix();

        environmentEffectState.group.add(points);
        environmentEffectState.dustSystems.push({
            geometry,
            material,
            points,
            speeds,
            minY: layer.minY,
            height: layer.height,
            maxY: layer.minY + layer.height
        });
    });

    const fallbackEnemyTarget = gameState.enemies[0]?.position
        ? gameState.enemies[0].position.clone()
        : new THREE.Vector3(0, 1, -8);
    const fallbackPlayerTarget = gameState.player.position.clone();

    const volumetricConfigs = [
        {
            key: 'frost',
            color: 0x7cc9ff,
            position: new THREE.Vector3(-8, 13.5, -9),
            target: fallbackEnemyTarget,
            angle: Math.PI / 5,
            intensity: 1.05,
            distance: 52,
            penumbra: 0.65,
            coneHeight: 18,
            coneRadius: 7,
            coneOpacity: 0.42,
            waveFrequency: 0.45,
            waveAmplitude: 0.12,
            pulseDecay: 1.4,
            coneIntensityScale: 0.32,
            targetProvider: () => gameState.enemies[0]?.position || null
        },
        {
            key: 'arcane',
            color: 0xc39dff,
            position: new THREE.Vector3(7, 13.8, -7),
            target: fallbackEnemyTarget.clone().add(new THREE.Vector3(1, 0, 0)),
            angle: Math.PI / 4.5,
            intensity: 0.85,
            distance: 50,
            penumbra: 0.55,
            coneHeight: 16,
            coneRadius: 6,
            coneOpacity: 0.36,
            waveFrequency: 0.6,
            waveAmplitude: 0.1,
            pulseDecay: 1.2,
            coneIntensityScale: 0.35,
            targetProvider: () => gameState.enemies[0]?.position || null
        },
        {
            key: 'shadow',
            color: 0x6d3a7c,
            position: new THREE.Vector3(0, 12.5, 7),
            target: fallbackPlayerTarget,
            angle: Math.PI / 4.2,
            intensity: 0.7,
            distance: 44,
            penumbra: 0.5,
            coneHeight: 14,
            coneRadius: 6.5,
            coneOpacity: 0.34,
            waveFrequency: 0.5,
            waveAmplitude: 0.08,
            pulseDecay: 1.1,
            coneIntensityScale: 0.4,
            targetProvider: () => gameState.player.position || null
        }
    ];

    volumetricConfigs.forEach(config => {
        const spotlight = new THREE.SpotLight(config.color, config.intensity, config.distance, config.angle, config.penumbra, 1.6);
        spotlight.castShadow = false;
        spotlight.position.copy(config.position);
        spotlight.decay = 1.4;
        spotlight.name = `${config.key}-volumetric-light`;

        const targetObject = new THREE.Object3D();
        targetObject.position.copy(config.target);
        scene.add(targetObject);
        spotlight.target = targetObject;
        scene.add(spotlight);

        const helper = new THREE.SpotLightHelper(spotlight, config.color);
        if (helper.material) {
            helper.material.transparent = true;
            helper.material.opacity = 0.2;
        }
        scene.add(helper);

        const coneGeometry = new THREE.ConeGeometry(config.coneRadius, config.coneHeight, 32, 1, true);
        coneGeometry.translate(0, -config.coneHeight / 2, 0);
        const coneMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(config.color) },
                intensity: { value: config.intensity * config.coneIntensityScale },
                coneHeight: { value: config.coneHeight },
                maxRadius: { value: config.coneRadius },
                time: { value: 0 }
            },
            vertexShader: `varying float vHeight;\n` +
                `varying float vRadius;\n` +
                `void main() {\n` +
                `    vHeight = position.y;\n` +
                `    vRadius = length(position.xz);\n` +
                `    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n` +
                `}`,
            fragmentShader: `uniform vec3 color;\n` +
                `uniform float intensity;\n` +
                `uniform float coneHeight;\n` +
                `uniform float maxRadius;\n` +
                `uniform float time;\n` +
                `varying float vHeight;\n` +
                `varying float vRadius;\n` +
                `void main() {\n` +
                `    float heightFactor = clamp(1.0 - (vHeight / coneHeight), 0.0, 1.0);\n` +
                `    float radiusFactor = clamp(1.0 - (vRadius / maxRadius), 0.0, 1.0);\n` +
                `    float flicker = 0.2 + 0.8 * abs(sin((vHeight * 0.45) + time * 0.6));\n` +
                `    float alpha = intensity * heightFactor * radiusFactor * flicker;\n` +
                `    if (alpha < 0.01) discard;\n` +
                `    gl_FragColor = vec4(color, alpha);\n` +
                `}`,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
        coneMesh.rotation.x = Math.PI;
        coneMesh.frustumCulled = false;
        coneMesh.renderOrder = -5;

        const coneGroup = new THREE.Group();
        coneGroup.name = `${config.key}-volumetric-cone`;
        coneGroup.position.copy(config.position);
        coneGroup.add(coneMesh);
        coneGroup.lookAt(config.target);
        environmentEffectState.group.add(coneGroup);

        environmentEffectState.volumetricLights.push({
            key: config.key,
            spotlight,
            helper,
            coneGroup,
            coneMaterial,
            coneIntensityScale: config.coneIntensityScale,
            baseIntensity: config.intensity,
            currentIntensity: config.intensity,
            pulse: 0,
            maxPulse: 1.5,
            pulseDecay: config.pulseDecay,
            waveFrequency: config.waveFrequency,
            waveAmplitude: config.waveAmplitude,
            elapsed: 0,
            targetProvider: config.targetProvider,
            targetObject
        });
    });

    environmentEffectState.typeMap = {
        'arcane': 'arcane',
        'arcane-missiles': 'arcane',
        'arcaneImpact': 'arcane',
        'blink': 'arcane',
        'frost': 'frost',
        'frost-cast': 'frost',
        'frost-field': 'frost',
        'frost-cone': 'frost',
        'cone-of-cold': 'frost',
        'shadow': 'shadow',
        'shadow-strike': 'shadow',
        'directional-slash': 'shadow',
        'stealth-entry': 'shadow',
        'finisher': 'shadow',
        'speed-trail': 'shadow',
        'defensive-shield': 'arcane'
    };

    return environmentEffectState;
}

function updateEnvironmentEffects(deltaTime) {
    if (!environmentEffectState.initialized) {
        return;
    }

    environmentEffectState.dustSystems.forEach(system => {
        const { geometry, speeds, minY, height, maxY } = system;
        const positionAttr = geometry.getAttribute('position');
        const array = positionAttr.array;
        for (let i = 0; i < speeds.length; i++) {
            const idx = i * 3 + 1;
            let y = array[idx] + deltaTime * speeds[i];
            if (y > maxY) {
                const wrapped = (y - minY) % height;
                y = minY + wrapped;
            }
            array[idx] = y;
        }
        positionAttr.needsUpdate = true;
    });

    environmentEffectState.volumetricLights.forEach(light => {
        light.elapsed += deltaTime;
        light.pulse = Math.max(0, light.pulse - light.pulseDecay * deltaTime);
        const wave = Math.sin(light.elapsed * light.waveFrequency) * light.waveAmplitude;
        const targetIntensity = light.baseIntensity + wave + light.pulse;
        light.currentIntensity = THREE.MathUtils.lerp(light.currentIntensity, targetIntensity, 0.15);
        light.spotlight.intensity = light.currentIntensity;
        light.coneMaterial.uniforms.intensity.value = light.currentIntensity * light.coneIntensityScale;
        light.coneMaterial.uniforms.time.value += deltaTime;
        if (typeof light.targetProvider === 'function') {
            const targetPosition = light.targetProvider();
            if (targetPosition) {
                light.targetObject.position.copy(targetPosition);
                light.spotlight.target.updateMatrixWorld();
                light.coneGroup.lookAt(targetPosition);
            }
        }

        if (light.helper && typeof light.helper.update === 'function') {
            light.helper.update();
        }
    });
}

function pulseVolumetricLight(effectType, strength = 0.9) {
    if (!environmentEffectState.initialized || !effectType) {
        return;
    }

    const key = environmentEffectState.typeMap[effectType] || effectType;
    environmentEffectState.volumetricLights.forEach(light => {
        if (light.key === key) {
            light.pulse = Math.min(light.maxPulse, light.pulse + strength);
        }
    });
}

function createArenaPillars(radius = 32, pillarCount = 8) {
    const pillarGeometry = new THREE.CylinderGeometry(1.2, 1.6, 12, 12);
    const pillarMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a4a6a,
        roughness: 0.6,
        metalness: 0.2
    });

    for (let i = 0; i < pillarCount; i++) {
        const angle = (i / pillarCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        pillar.position.set(x, sampleTerrainHeight(x, z) + 6, z);
        pillar.lookAt(0, pillar.position.y, 0);
        scene.add(pillar);
    }
}

const treeTrunkGeometry = new THREE.CylinderGeometry(0.25, 0.35, 2.6, 8);
const treeFoliageGeometry = new THREE.ConeGeometry(1.6, 3.8, 9);
const treeTrunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b5a2b,
    roughness: 0.9,
    metalness: 0.05
});
const treeFoliageMaterial = new THREE.MeshStandardMaterial({
    color: 0x1f4d2a,
    roughness: 0.6,
    metalness: 0.1
});

function scatterTrees(treeCount = 18, minRadius = 10, maxRadius = 34) {
    for (let i = 0; i < treeCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = THREE.MathUtils.lerp(minRadius, maxRadius, Math.random());
        const scale = THREE.MathUtils.lerp(0.8, 1.6, Math.random());
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = sampleTerrainHeight(x, z);

        const tree = new THREE.Group();
        const trunk = new THREE.Mesh(treeTrunkGeometry, treeTrunkMaterial);
        trunk.position.y = 1.3;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        tree.add(trunk);

        const foliage = new THREE.Mesh(treeFoliageGeometry, treeFoliageMaterial);
        foliage.position.y = 2.6 + 1.9;
        foliage.castShadow = true;
        foliage.receiveShadow = true;
        tree.add(foliage);

        tree.position.set(x, y, z);
        tree.scale.setScalar(scale);
        tree.rotation.y = Math.random() * Math.PI * 2;
        scene.add(tree);
    }
}

const bannerPoleGeometry = new THREE.CylinderGeometry(0.12, 0.16, 6, 10);
const bannerBaseGeometry = new THREE.CylinderGeometry(0.5, 0.6, 0.4, 10);
const bannerClothGeometry = new THREE.PlaneGeometry(2.2, 3.4, 4, 8);
const bannerPoleMaterial = new THREE.MeshStandardMaterial({
    color: 0xa3a5b1,
    roughness: 0.35,
    metalness: 0.6
});
const bannerBaseMaterial = new THREE.MeshStandardMaterial({
    color: 0x272733,
    roughness: 0.7,
    metalness: 0.15
});
const bannerClothMaterial = new THREE.MeshStandardMaterial({
    color: 0x7d1a2f,
    roughness: 0.55,
    metalness: 0.2,
    side: THREE.DoubleSide
});

function createBattleBanners(bannerCount = 6, radius = 22) {
    for (let i = 0; i < bannerCount; i++) {
        const group = new THREE.Group();
        const pole = new THREE.Mesh(bannerPoleGeometry, bannerPoleMaterial);
        pole.position.y = 3;
        pole.castShadow = true;
        pole.receiveShadow = true;
        group.add(pole);

        const base = new THREE.Mesh(bannerBaseGeometry, bannerBaseMaterial);
        base.position.y = 0.2;
        base.receiveShadow = true;
        group.add(base);

        const cloth = new THREE.Mesh(bannerClothGeometry, bannerClothMaterial);
        cloth.position.set(1.1, 3.4, 0);
        cloth.rotation.y = Math.PI / 2;
        cloth.castShadow = true;
        cloth.receiveShadow = true;
        group.add(cloth);

        const angle = (i / bannerCount) * Math.PI * 2;
        const radiusVariation = THREE.MathUtils.lerp(-2, 2, Math.random());
        const x = Math.cos(angle) * (radius + radiusVariation);
        const z = Math.sin(angle) * (radius + radiusVariation);
        const y = sampleTerrainHeight(x, z);
        group.position.set(x, y, z);
        group.lookAt(0, y, 0);
        scene.add(group);
    }
}

function scatterRocks(minRadius = 12, maxRadius = 36) {
    const rockGeometry = new THREE.IcosahedronGeometry(1.6, 1);
    const rockMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: loadTextureWithOptions(environmentTextures.rocks.albedo, {
            encoding: 'sRGB',
            repeat: [3, 3],
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping
        }),
        normalMap: loadTextureWithOptions(environmentTextures.rocks.normal, {
            repeat: [3, 3],
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping
        }),
        roughnessMap: loadTextureWithOptions(environmentTextures.rocks.roughness, {
            repeat: [3, 3],
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping
        })
    });

    scatterInstancedMeshes({
        geometry: rockGeometry,
        material: rockMaterial,
        count: 48,
        minRadius,
        maxRadius,
        minScale: 0.5,
        maxScale: 2.2,
        yOffset: 0
    });
}

function initEnvironment() {
    const terrainSize = 80;
    const terrainSegments = 256;
    const groundGeometry = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainSegments, terrainSegments);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: loadTextureWithOptions(environmentTextures.terrain.albedo, {
            encoding: 'sRGB',
            repeat: [12, 12],
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping
        }),
        normalMap: loadTextureWithOptions(environmentTextures.terrain.normal, {
            repeat: [12, 12],
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping
        }),
        roughnessMap: loadTextureWithOptions(environmentTextures.terrain.roughness, {
            repeat: [12, 12],
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping
        })
    });

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.name = 'arenaGround';
    scene.add(ground);

    createEnvironmentEffects();

    applyHeightMapToGeometry(groundGeometry, environmentTextures.terrain.height, 7).then(sampler => {
        terrainHeightSampler = sampler || ((x, z) => 0);
        createArenaPillars();
        scatterRocks();
        scatterTrees();
        createBattleBanners();
    });
}

const characterAppearances = {
    player: {
        'stealth-leather': {
            body: {
                map: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/uv_grid_opengl.jpg',
                normalMap: 'https://threejsfundamentals.org/threejs/resources/images/wall/wall-normal.jpg',
                roughnessMap: 'https://threejsfundamentals.org/threejs/resources/images/wall/wall-roughness.jpg',
                color: 0xffffff,
                metalness: 0.2,
                roughness: 1.0,
                repeat: [1, 1]
            },
            attachments: {
                hood: {
                    texture: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/uv_grid_opengl.jpg',
                    color: 0x202028,
                    repeat: [2, 2],
                    offset: { x: 0, y: 0.08, z: 0.02 },
                    rotation: { x: -Math.PI / 16, y: 0, z: 0 },
                    scale: { x: 1.05, y: 0.9, z: 1.05 }
                },
                shoulders: {
                    texture: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/uv_grid_opengl.jpg',
                    color: 0x394064,
                    repeat: [1.5, 1],
                    size: { x: 0.28, y: 0.16, z: 0.4 },
                    offset: { x: 0.22, y: -0.05, z: -0.02 }
                },
                belt: {
                    texture: 'https://threejs.org/examples/textures/brick_diffuse.jpg',
                    color: 0x5b442d,
                    repeat: [2, 1],
                    radius: 0.55,
                    thickness: 0.08,
                    offsetY: -0.2
                }
            }
        },
        'crimson-assassin': {
            body: {
                map: 'https://threejs.org/examples/textures/brick_diffuse.jpg',
                normalMap: 'https://threejs.org/examples/textures/brick_normal.jpg',
                roughnessMap: 'https://threejs.org/examples/textures/brick_roughness.jpg',
                color: 0xffd9d9,
                metalness: 0.15,
                roughness: 0.85,
                repeat: [1.6, 1.6]
            },
            attachments: {
                hood: {
                    texture: 'https://threejs.org/examples/textures/brick_diffuse.jpg',
                    color: 0x4f0d18,
                    repeat: [3, 3],
                    offset: { x: 0, y: 0.09, z: 0.03 },
                    rotation: { x: -Math.PI / 18, y: 0, z: 0 },
                    scale: { x: 1.1, y: 0.95, z: 1.1 }
                },
                shoulders: {
                    texture: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/uv_grid_opengl.jpg',
                    color: 0x811f35,
                    repeat: [2, 1],
                    size: { x: 0.3, y: 0.18, z: 0.42 },
                    offset: { x: 0.24, y: -0.04, z: 0.0 }
                },
                belt: {
                    texture: 'https://threejs.org/examples/textures/brick_diffuse.jpg',
                    color: 0x3c1a1f,
                    repeat: [3, 1],
                    radius: 0.58,
                    thickness: 0.09,
                    offsetY: -0.18
                }
            }
        }
    },
    enemy: {
        'frost-regalia': {
            body: {
                map: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/DamagedHelmet/glTF/Default_albedo.jpg',
                normalMap: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/DamagedHelmet/glTF/Default_normal.jpg',
                roughnessMap: 'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/DamagedHelmet/glTF/Default_metalRoughness.jpg',
                color: 0xffffff,
                metalness: 0.1,
                roughness: 0.9,
                repeat: [1, 1],
                flipY: false
            },
            attachments: {
                hood: {
                    texture: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
                    color: 0x9bd4ff,
                    repeat: [2, 1],
                    offset: { x: 0, y: 0.1, z: 0.05 },
                    rotation: { x: -Math.PI / 20, y: 0, z: 0 },
                    scale: { x: 1.1, y: 0.92, z: 1.15 }
                },
                shoulders: {
                    texture: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/uv_grid_opengl.jpg',
                    color: 0x6cbaff,
                    repeat: [2, 1.2],
                    size: { x: 0.35, y: 0.22, z: 0.5 },
                    offset: { x: 0.28, y: -0.02, z: 0.05 }
                },
                belt: {
                    texture: 'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg',
                    color: 0x4a91ff,
                    repeat: [2.5, 1],
                    radius: 0.65,
                    thickness: 0.1,
                    offsetY: -0.22
                }
            }
        },
        'arcane-warden': {
            body: {
                map: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
                normalMap: 'https://threejs.org/examples/textures/water/Water_1_M_Normal.jpg',
                roughnessMap: 'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg',
                color: 0xe2d9ff,
                metalness: 0.25,
                roughness: 0.7,
                repeat: [1.2, 1.2]
            },
            attachments: {
                hood: {
                    texture: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
                    color: 0x403a80,
                    repeat: [2, 2],
                    offset: { x: 0, y: 0.11, z: 0.02 },
                    rotation: { x: -Math.PI / 24, y: 0, z: 0 },
                    scale: { x: 1.1, y: 0.96, z: 1.12 }
                },
                shoulders: {
                    texture: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/uv_grid_opengl.jpg',
                    color: 0x6a5bdc,
                    repeat: [1.8, 1.1],
                    size: { x: 0.33, y: 0.2, z: 0.48 },
                    offset: { x: 0.26, y: -0.03, z: 0.04 }
                },
                belt: {
                    texture: 'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg',
                    color: 0x2c2457,
                    repeat: [3, 1],
                    radius: 0.64,
                    thickness: 0.09,
                    offsetY: -0.24
                }
            }
        }
    }
};

function getCharacterAppearance(characterType, appearanceSet) {
    const options = characterAppearances[characterType] || {};
    if (appearanceSet && options[appearanceSet]) {
        return options[appearanceSet];
    }
    const firstKey = Object.keys(options)[0];
    return firstKey ? options[firstKey] : null;
}

function findBoneByNames(model, names) {
    if (!model || !names) return null;
    for (const name of names) {
        const bone = model.getObjectByName(name);
        if (bone) {
            return bone;
        }
    }
    return null;
}

function clearAttachmentGroup(group) {
    if (!group) return;
    const attachments = group.userData.attachments || [];
    attachments.forEach(attachment => {
        if (attachment.parent) {
            attachment.parent.remove(attachment);
        }
        if (Array.isArray(attachment.material)) {
            attachment.material.forEach(mat => mat.dispose?.());
        } else {
            attachment.material?.dispose?.();
        }
        attachment.geometry?.dispose?.();
    });
    group.userData.attachments = [];
}

function trackAppearanceMaterial(store, material) {
    if (!material) return;
    if (!store.includes(material)) {
        store.push(material);
    }
}

function setMaterialOpacity(material, opacity, transparent) {
    if (!material) return;
    if (Array.isArray(material)) {
        material.forEach(mat => {
            mat.opacity = opacity;
            mat.transparent = transparent;
            mat.needsUpdate = true;
        });
        return;
    }
    material.opacity = opacity;
    material.transparent = transparent;
    material.needsUpdate = true;
}

function setPlayerAppearanceOpacity(opacity, transparent) {
    const materials = playerMesh?.userData?.appearanceMaterials || [];
    materials.forEach(material => setMaterialOpacity(material, opacity, transparent));
}

function updateSkinSelectors() {
    const playerSelect = document.getElementById('playerSkinSelect');
    if (playerSelect) {
        playerSelect.value = gameState.player.appearanceSet;
    }

    const enemySelect = document.getElementById('enemySkinSelect');
    if (enemySelect) {
        const currentEnemy = getCurrentEnemy();
        if (currentEnemy) {
            enemySelect.value = currentEnemy.appearanceSet;
        }
    }
}

function formatAppearanceLabel(appearance) {
    return appearance
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

function updatePlayerSkinOptions() {
    const playerSelect = document.getElementById('playerSkinSelect');
    if (!playerSelect) {
        return;
    }
    const playerOptions = gameState.player.availableAppearances && gameState.player.availableAppearances.length
        ? gameState.player.availableAppearances
        : [gameState.player.appearanceSet];
    playerSelect.innerHTML = playerOptions.map(appearance =>
        `<option value="${appearance}">${formatAppearanceLabel(appearance)}</option>`
    ).join('');
    playerSelect.value = gameState.player.appearanceSet;
}

function updateEnemySkinOptions(enemy = getCurrentEnemy()) {
    const enemySelect = document.getElementById('enemySkinSelect');
    if (!enemySelect) {
        return;
    }
    const baseAvailable = enemy?.availableAppearances || (gameState.enemies[0]?.availableAppearances ?? []);
    const available = baseAvailable.length ? baseAvailable : (enemy ? [enemy.appearanceSet] : []);
    enemySelect.innerHTML = available.map(appearance =>
        `<option value="${appearance}">${formatAppearanceLabel(appearance)}</option>`
    ).join('');
    if (enemy) {
        enemySelect.value = enemy.appearanceSet;
    }
}

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 5);
directionalLight.castShadow = true;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
scene.add(directionalLight);

initEnvironment();

// Create player (Rogue)
const playerMesh = new THREE.Group();
playerMesh.castShadow = true;
playerMesh.userData.appearanceMaterials = [];
scene.add(playerMesh);
playerMesh.position.copy(gameState.player.position);

const playerArmorGroup = new THREE.Group();
playerArmorGroup.name = 'playerArmorGroup';
playerArmorGroup.userData.attachments = [];
playerMesh.add(playerArmorGroup);

let playerBodyMaterial = null;

function applyPlayerAppearance() {
    const baseModel = playerMesh.userData.baseModel;
    const appearance = getCharacterAppearance('player', gameState.player.appearanceSet);
    if (!baseModel || !appearance) {
        return;
    }

    const previousMaterial = playerBodyMaterial;
    const materialConfig = {
        color: new THREE.Color(appearance.body.color ?? 0xffffff),
        metalness: appearance.body.metalness ?? 0.2,
        roughness: appearance.body.roughness ?? 0.9
    };

    const bodyMap = loadTextureWithOptions(appearance.body.map, {
        encoding: 'sRGB',
        repeat: appearance.body.repeat,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping
    });
    if (bodyMap) {
        materialConfig.map = bodyMap;
    }

    const normalMap = loadTextureWithOptions(appearance.body.normalMap, {
        repeat: appearance.body.repeat,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping
    });
    if (normalMap) {
        materialConfig.normalMap = normalMap;
    }

    const roughnessMap = loadTextureWithOptions(appearance.body.roughnessMap, {
        repeat: appearance.body.repeat,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        flipY: appearance.body.flipY
    });
    if (roughnessMap) {
        materialConfig.roughnessMap = roughnessMap;
    }

    playerBodyMaterial = new THREE.MeshStandardMaterial(materialConfig);
    baseModel.traverse(child => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = playerBodyMaterial;
        }
    });

    if (previousMaterial) {
        previousMaterial.dispose();
    }

    playerMesh.userData.appearanceMaterials = [playerBodyMaterial];

    clearAttachmentGroup(playerArmorGroup);

    const headBone = findBoneByNames(baseModel, ['mixamorigHead', 'Head', 'HeadTop_End']);
    const leftShoulderBone = findBoneByNames(baseModel, ['mixamorigLeftShoulder', 'LeftShoulder', 'Shoulder.L']);
    const rightShoulderBone = findBoneByNames(baseModel, ['mixamorigRightShoulder', 'RightShoulder', 'Shoulder.R']);
    const spineBone = findBoneByNames(baseModel, ['mixamorigSpine', 'mixamorigSpine1', 'Spine', 'Hips']);

    if (appearance.attachments?.hood) {
        const hoodTexture = loadTextureWithOptions(appearance.attachments.hood.texture, {
            encoding: 'sRGB',
            repeat: appearance.attachments.hood.repeat,
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping
        });
        const hoodMaterial = new THREE.MeshStandardMaterial({
            map: hoodTexture,
            color: new THREE.Color(appearance.attachments.hood.color ?? 0xffffff),
            metalness: appearance.attachments.hood.metalness ?? 0.05,
            roughness: appearance.attachments.hood.roughness ?? 0.85
        });
        const hoodGeometry = new THREE.SphereGeometry(
            appearance.attachments.hood.radius ?? 0.9,
            24,
            18,
            0,
            Math.PI * 2,
            0,
            Math.PI / 1.6
        );
        const hoodMesh = new THREE.Mesh(hoodGeometry, hoodMaterial);
        hoodMesh.name = 'playerHood';
        hoodMesh.castShadow = true;
        hoodMesh.receiveShadow = true;
        const hoodScale = appearance.attachments.hood.scale || {};
        hoodMesh.scale.set(hoodScale.x ?? 1, hoodScale.y ?? 0.9, hoodScale.z ?? 1);
        const hoodOffset = appearance.attachments.hood.offset || {};
        hoodMesh.position.set(hoodOffset.x ?? 0, hoodOffset.y ?? 0.08, hoodOffset.z ?? 0.02);
        const hoodRotation = appearance.attachments.hood.rotation || {};
        hoodMesh.rotation.set(
            hoodRotation.x ?? -Math.PI / 16,
            hoodRotation.y ?? 0,
            hoodRotation.z ?? 0
        );
        (headBone || baseModel).add(hoodMesh);
        playerArmorGroup.userData.attachments.push(hoodMesh);
        trackAppearanceMaterial(playerMesh.userData.appearanceMaterials, hoodMaterial);
    }

    if (appearance.attachments?.shoulders) {
        const shoulderTexture = loadTextureWithOptions(appearance.attachments.shoulders.texture, {
            encoding: 'sRGB',
            repeat: appearance.attachments.shoulders.repeat,
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping
        });
        const shoulderMaterial = new THREE.MeshStandardMaterial({
            map: shoulderTexture,
            color: new THREE.Color(appearance.attachments.shoulders.color ?? 0xffffff),
            metalness: appearance.attachments.shoulders.metalness ?? 0.15,
            roughness: appearance.attachments.shoulders.roughness ?? 0.75
        });
        const size = appearance.attachments.shoulders.size || {};
        const shoulderGeometry = new THREE.BoxGeometry(
            size.x ?? 0.28,
            size.y ?? 0.16,
            size.z ?? 0.4
        );

        const shoulderOffset = appearance.attachments.shoulders.offset || {};

        const leftShoulder = new THREE.Mesh(shoulderGeometry.clone(), shoulderMaterial);
        leftShoulder.name = 'playerShoulderLeft';
        leftShoulder.castShadow = true;
        leftShoulder.receiveShadow = true;
        leftShoulder.position.set(
            shoulderOffset.x ?? 0.22,
            shoulderOffset.y ?? -0.05,
            shoulderOffset.z ?? -0.02
        );
        const leftParent = leftShoulderBone || baseModel;
        leftParent.add(leftShoulder);
        playerArmorGroup.userData.attachments.push(leftShoulder);

        const rightShoulder = new THREE.Mesh(shoulderGeometry.clone(), shoulderMaterial);
        rightShoulder.name = 'playerShoulderRight';
        rightShoulder.castShadow = true;
        rightShoulder.receiveShadow = true;
        rightShoulder.position.set(
            -(shoulderOffset.x ?? 0.22),
            shoulderOffset.y ?? -0.05,
            shoulderOffset.z ?? -0.02
        );
        const rightParent = rightShoulderBone || baseModel;
        rightParent.add(rightShoulder);
        playerArmorGroup.userData.attachments.push(rightShoulder);

        trackAppearanceMaterial(playerMesh.userData.appearanceMaterials, shoulderMaterial);
    }

    if (appearance.attachments?.belt) {
        const beltTexture = loadTextureWithOptions(appearance.attachments.belt.texture, {
            encoding: 'sRGB',
            repeat: appearance.attachments.belt.repeat,
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping
        });
        const beltMaterial = new THREE.MeshStandardMaterial({
            map: beltTexture,
            color: new THREE.Color(appearance.attachments.belt.color ?? 0xffffff),
            metalness: appearance.attachments.belt.metalness ?? 0.2,
            roughness: appearance.attachments.belt.roughness ?? 0.6
        });
        const beltGeometry = new THREE.TorusGeometry(
            appearance.attachments.belt.radius ?? 0.55,
            appearance.attachments.belt.thickness ?? 0.08,
            16,
            32
        );
        const beltMesh = new THREE.Mesh(beltGeometry, beltMaterial);
        beltMesh.name = 'playerBelt';
        beltMesh.rotation.x = Math.PI / 2;
        beltMesh.castShadow = true;
        beltMesh.receiveShadow = true;
        beltMesh.position.y = appearance.attachments.belt.offsetY ?? -0.2;
        const beltParent = spineBone || baseModel;
        beltParent.add(beltMesh);
        playerArmorGroup.userData.attachments.push(beltMesh);
        trackAppearanceMaterial(playerMesh.userData.appearanceMaterials, beltMaterial);
    }

    if (gameState.player.isStealthed) {
        setPlayerAppearanceOpacity(0.3, true);
    }
}

gltfLoader.load(
    'https://threejs.org/examples/models/gltf/Xbot.glb',
    gltf => {
        const model = gltf.scene;
        model.scale.set(0.018, 0.018, 0.018);
        model.position.set(0, -1.0, 0);
        playerMesh.add(model);
        playerMesh.userData.baseModel = model;
        applyPlayerAppearance();
        updatePlayerSkinOptions();
        updateSkinSelectors();
    },
    undefined,
    error => {
        console.error('Failed to load player model', error);
    }
);

// Create enemy (Frost Mage)
const enemyMesh = new THREE.Group();
enemyMesh.castShadow = true;
enemyMesh.userData.appearanceMaterials = [];
scene.add(enemyMesh);
const firstEnemy = getCurrentEnemy();
if (firstEnemy) {
    enemyMesh.position.copy(firstEnemy.position);
}

const enemyRobeGroup = new THREE.Group();
enemyRobeGroup.name = 'enemyRobeGroup';
enemyRobeGroup.userData.attachments = [];
enemyMesh.add(enemyRobeGroup);

let enemyBodyMaterial = null;

function applyEnemyAppearance(targetEnemy = getCurrentEnemy()) {
    const baseModel = enemyMesh.userData.baseModel;
    if (!baseModel || !targetEnemy) {
        return;
    }
    const appearance = getCharacterAppearance('enemy', targetEnemy.appearanceSet);
    if (!appearance) {
        return;
    }

    const previousMaterial = enemyBodyMaterial;
    const materialConfig = {
        color: new THREE.Color(appearance.body.color ?? 0xffffff),
        metalness: appearance.body.metalness ?? 0.1,
        roughness: appearance.body.roughness ?? 0.9
    };

    const bodyMap = loadTextureWithOptions(appearance.body.map, {
        encoding: 'sRGB',
        repeat: appearance.body.repeat,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        flipY: appearance.body.flipY
    });
    if (bodyMap) {
        materialConfig.map = bodyMap;
    }

    const normalMap = loadTextureWithOptions(appearance.body.normalMap, {
        repeat: appearance.body.repeat,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        flipY: appearance.body.flipY
    });
    if (normalMap) {
        materialConfig.normalMap = normalMap;
    }

    const roughnessMap = loadTextureWithOptions(appearance.body.roughnessMap, {
        repeat: appearance.body.repeat,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        flipY: appearance.body.flipY
    });
    if (roughnessMap) {
        materialConfig.roughnessMap = roughnessMap;
    }

    enemyBodyMaterial = new THREE.MeshStandardMaterial(materialConfig);
    baseModel.traverse(child => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = enemyBodyMaterial;
        }
    });

    if (previousMaterial) {
        previousMaterial.dispose();
    }

    enemyMesh.userData.appearanceMaterials = [enemyBodyMaterial];

    clearAttachmentGroup(enemyRobeGroup);

    const headBone = findBoneByNames(baseModel, ['mixamorigHead', 'Head', 'HeadTop_End']);
    const leftShoulderBone = findBoneByNames(baseModel, ['mixamorigLeftShoulder', 'LeftShoulder', 'Shoulder.L']);
    const rightShoulderBone = findBoneByNames(baseModel, ['mixamorigRightShoulder', 'RightShoulder', 'Shoulder.R']);
    const spineBone = findBoneByNames(baseModel, ['mixamorigSpine', 'Spine', 'Hips']);

    if (appearance.attachments?.hood) {
        const hoodTexture = loadTextureWithOptions(appearance.attachments.hood.texture, {
            encoding: 'sRGB',
            repeat: appearance.attachments.hood.repeat,
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping
        });
        const hoodMaterial = new THREE.MeshStandardMaterial({
            map: hoodTexture,
            color: new THREE.Color(appearance.attachments.hood.color ?? 0xffffff),
            metalness: appearance.attachments.hood.metalness ?? 0.08,
            roughness: appearance.attachments.hood.roughness ?? 0.78
        });
        const hoodGeometry = new THREE.SphereGeometry(
            appearance.attachments.hood.radius ?? 1.1,
            28,
            20,
            0,
            Math.PI * 2,
            0,
            Math.PI / 1.6
        );
        const hoodMesh = new THREE.Mesh(hoodGeometry, hoodMaterial);
        hoodMesh.name = 'enemyHood';
        hoodMesh.castShadow = true;
        hoodMesh.receiveShadow = true;
        const hoodScale = appearance.attachments.hood.scale || {};
        hoodMesh.scale.set(hoodScale.x ?? 1.05, hoodScale.y ?? 0.95, hoodScale.z ?? 1.1);
        const hoodOffset = appearance.attachments.hood.offset || {};
        hoodMesh.position.set(hoodOffset.x ?? 0, hoodOffset.y ?? 0.1, hoodOffset.z ?? 0.05);
        const hoodRotation = appearance.attachments.hood.rotation || {};
        hoodMesh.rotation.set(
            hoodRotation.x ?? -Math.PI / 20,
            hoodRotation.y ?? 0,
            hoodRotation.z ?? 0
        );
        (headBone || baseModel).add(hoodMesh);
        enemyRobeGroup.userData.attachments.push(hoodMesh);
        trackAppearanceMaterial(enemyMesh.userData.appearanceMaterials, hoodMaterial);
    }

    if (appearance.attachments?.shoulders) {
        const shoulderTexture = loadTextureWithOptions(appearance.attachments.shoulders.texture, {
            encoding: 'sRGB',
            repeat: appearance.attachments.shoulders.repeat,
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping
        });
        const shoulderMaterial = new THREE.MeshStandardMaterial({
            map: shoulderTexture,
            color: new THREE.Color(appearance.attachments.shoulders.color ?? 0xffffff),
            metalness: appearance.attachments.shoulders.metalness ?? 0.18,
            roughness: appearance.attachments.shoulders.roughness ?? 0.7
        });
        const size = appearance.attachments.shoulders.size || {};
        const shoulderGeometry = new THREE.BoxGeometry(
            size.x ?? 0.35,
            size.y ?? 0.22,
            size.z ?? 0.5
        );
        const shoulderOffset = appearance.attachments.shoulders.offset || {};

        const leftShoulder = new THREE.Mesh(shoulderGeometry.clone(), shoulderMaterial);
        leftShoulder.name = 'enemyShoulderLeft';
        leftShoulder.castShadow = true;
        leftShoulder.receiveShadow = true;
        leftShoulder.position.set(
            shoulderOffset.x ?? 0.28,
            shoulderOffset.y ?? -0.02,
            shoulderOffset.z ?? 0.05
        );
        (leftShoulderBone || baseModel).add(leftShoulder);
        enemyRobeGroup.userData.attachments.push(leftShoulder);

        const rightShoulder = new THREE.Mesh(shoulderGeometry.clone(), shoulderMaterial);
        rightShoulder.name = 'enemyShoulderRight';
        rightShoulder.castShadow = true;
        rightShoulder.receiveShadow = true;
        rightShoulder.position.set(
            -(shoulderOffset.x ?? 0.28),
            shoulderOffset.y ?? -0.02,
            shoulderOffset.z ?? 0.05
        );
        (rightShoulderBone || baseModel).add(rightShoulder);
        enemyRobeGroup.userData.attachments.push(rightShoulder);

        trackAppearanceMaterial(enemyMesh.userData.appearanceMaterials, shoulderMaterial);
    }

    if (appearance.attachments?.belt) {
        const beltTexture = loadTextureWithOptions(appearance.attachments.belt.texture, {
            encoding: 'sRGB',
            repeat: appearance.attachments.belt.repeat,
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping
        });
        const beltMaterial = new THREE.MeshStandardMaterial({
            map: beltTexture,
            color: new THREE.Color(appearance.attachments.belt.color ?? 0xffffff),
            metalness: appearance.attachments.belt.metalness ?? 0.22,
            roughness: appearance.attachments.belt.roughness ?? 0.65
        });
        const beltGeometry = new THREE.TorusGeometry(
            appearance.attachments.belt.radius ?? 0.6,
            appearance.attachments.belt.thickness ?? 0.1,
            16,
            32
        );
        const beltMesh = new THREE.Mesh(beltGeometry, beltMaterial);
        beltMesh.name = 'enemyBelt';
        beltMesh.rotation.x = Math.PI / 2;
        beltMesh.castShadow = true;
        beltMesh.receiveShadow = true;
        beltMesh.position.y = appearance.attachments.belt.offsetY ?? -0.22;
        (spineBone || baseModel).add(beltMesh);
        enemyRobeGroup.userData.attachments.push(beltMesh);
        trackAppearanceMaterial(enemyMesh.userData.appearanceMaterials, beltMaterial);
    }
}

gltfLoader.load(
    'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
    gltf => {
        const model = gltf.scene;
        model.scale.set(0.8, 0.8, 0.8);
        model.position.set(0, -1.25, 0);
        model.rotation.y = Math.PI;
        enemyMesh.add(model);
        enemyMesh.userData.baseModel = model;
        applyEnemyAppearance();
        updateEnemySkinOptions();
        updateSkinSelectors();
    },
    undefined,
    error => {
        console.error('Failed to load enemy model', error);
    }
);

gameState.setAppearance = function setAppearance(target, appearanceKey) {
    if (!appearanceKey) {
        return false;
    }

    if (target === 'player' || target === gameState.player) {
        if (gameState.player.availableAppearances &&
            !gameState.player.availableAppearances.includes(appearanceKey)) {
            return false;
        }
        gameState.player.appearanceSet = appearanceKey;
        applyPlayerAppearance();
        updateSkinSelectors();
        return true;
    }

    let enemy = null;
    if (typeof target === 'number') {
        enemy = gameState.enemies[target] || null;
    } else if (target && typeof target === 'object') {
        enemy = target;
    } else {
        enemy = getCurrentEnemy();
    }

    if (!enemy) {
        return false;
    }

    if (enemy.availableAppearances && !enemy.availableAppearances.includes(appearanceKey)) {
        return false;
    }

    enemy.appearanceSet = appearanceKey;
    if (enemy === getCurrentEnemy()) {
        applyEnemyAppearance(enemy);
        updateEnemySkinOptions(enemy);
    }
    updateSkinSelectors();
    return true;
};

// Particle system for effects
const effectClock = new THREE.Clock();
const spritesheetCache = new Map();

function colorToCanvasStyle(colorValue) {
    const color = new THREE.Color(colorValue);
    return color.getStyle();
}

function getSpritesheetTexture({ baseColor, highlightColor, frameCount = 4 }) {
    const cacheKey = `${frameCount}_${baseColor}_${highlightColor}`;
    if (spritesheetCache.has(cacheKey)) {
        return spritesheetCache.get(cacheKey);
    }

    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size * frameCount;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < frameCount; i++) {
        const progress = frameCount <= 1 ? 0 : i / (frameCount - 1);
        const centerX = size * (i + 0.5);
        const centerY = size / 2;
        const gradient = ctx.createRadialGradient(
            centerX,
            centerY,
            size * 0.05,
            centerX,
            centerY,
            size * (0.4 + 0.25 * (1 - progress))
        );

        gradient.addColorStop(0, highlightColor);
        gradient.addColorStop(0.4, baseColor);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.globalAlpha = 1 - progress * 0.2;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, size * (0.45 + 0.1 * (1 - progress)), 0, Math.PI * 2);
        ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(1 / frameCount, 1);
    texture.needsUpdate = true;

    const spritesheet = { texture, frameCount };
    spritesheetCache.set(cacheKey, spritesheet);
    return spritesheet;
}

class SimpleParticle {
    constructor(position, velocity, color, lifetime) {
        this.position = position.clone();
        this.velocity = velocity.clone();
        this.color = color;
        this.lifetime = lifetime;
        this.maxLifetime = lifetime;

        const geometry = new THREE.SphereGeometry(0.1, 4, 4);
        const material = new THREE.MeshBasicMaterial({ color, transparent: true });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        scene.add(this.mesh);
    }

    update(deltaTime) {
        this.lifetime -= deltaTime;
        if (this.lifetime <= 0) {
            scene.remove(this.mesh);
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
            return false;
        }

        this.position.addScaledVector(this.velocity, deltaTime);
        this.mesh.position.copy(this.position);
        this.mesh.material.opacity = THREE.MathUtils.clamp(this.lifetime / this.maxLifetime, 0, 1);

        return true;
    }
}

class SpriteParticle {
    constructor({
        position,
        velocity = new THREE.Vector3(),
        lifetime = 1,
        startSize = 1,
        endSize = 0.2,
        startOpacity = 1,
        endOpacity = 0,
        color = 0xffffff,
        endColor = null,
        frameCount = 4,
        additive = false,
        verticalDrift = 0
    }) {
        this.position = position.clone();
        this.velocity = velocity.clone();
        this.verticalDrift = verticalDrift;
        this.lifetime = lifetime;
        this.elapsed = 0;
        this.startSize = startSize;
        this.endSize = endSize;
        this.startOpacity = startOpacity;
        this.endOpacity = endOpacity;
        this.startColor = new THREE.Color(color);
        this.endColor = endColor ? new THREE.Color(endColor) : this.startColor.clone();
        this.frameCount = frameCount;

        const highlight = this.startColor.clone().lerp(new THREE.Color(0xffffff), 0.35);
        const spritesheet = getSpritesheetTexture({
            baseColor: colorToCanvasStyle(this.startColor),
            highlightColor: colorToCanvasStyle(highlight),
            frameCount
        });

        const texture = spritesheet.texture.clone();
        texture.repeat.copy(spritesheet.texture.repeat);
        texture.needsUpdate = true;

        this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: texture,
            color: this.startColor,
            transparent: true,
            blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
            depthWrite: false
        }));
        this.sprite.material.opacity = this.startOpacity;
        this.sprite.position.copy(this.position);
        this.sprite.scale.set(startSize, startSize, startSize);
        scene.add(this.sprite);
    }

    update(deltaTime) {
        this.elapsed += deltaTime;
        if (this.elapsed >= this.lifetime) {
            scene.remove(this.sprite);
            if (this.sprite.material.map) {
                this.sprite.material.map.dispose();
            }
            this.sprite.material.dispose();
            return false;
        }

        this.position.addScaledVector(this.velocity, deltaTime);
        this.position.y += this.verticalDrift * deltaTime;
        this.sprite.position.copy(this.position);

        const progress = THREE.MathUtils.clamp(this.elapsed / this.lifetime, 0, 1);
        const size = THREE.MathUtils.lerp(this.startSize, this.endSize, progress);
        this.sprite.scale.set(size, size, size);

        const color = this.startColor.clone().lerp(this.endColor, progress);
        this.sprite.material.color.copy(color);
        this.sprite.material.opacity = THREE.MathUtils.lerp(this.startOpacity, this.endOpacity, progress);

        if (this.frameCount > 1 && this.sprite.material.map) {
            const frame = Math.min(this.frameCount - 1, Math.floor(progress * this.frameCount));
            this.sprite.material.map.offset.x = frame / this.frameCount;
        }

        return true;
    }
}

const arcaneMissileShader = {
    vertexShader: `varying vec2 vUv;\nvoid main() {\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}`,
    fragmentShader: `varying vec2 vUv;\nuniform vec3 color;\nuniform float opacity;\nvoid main() {\n    vec2 centered = vUv - vec2(0.5);\n    float dist = length(centered);\n    float glow = smoothstep(0.45, 0.0, dist);\n    gl_FragColor = vec4(color, glow * opacity);\n}`
};

class ArcaneMissileProjectile {
    constructor({ origin, target, duration = 0.9, color = 0xb695ff, startSize = 1.1, endSize = 0.25, onComplete = null }) {
        this.origin = origin.clone();
        this.target = target.clone();
        this.duration = duration;
        this.elapsed = 0;
        this.startSize = startSize;
        this.endSize = endSize;
        this.onComplete = onComplete;
        this.direction = this.target.clone().sub(this.origin).normalize();
        this.color = new THREE.Color(color);

        this.geometry = new THREE.PlaneGeometry(1, 1);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: this.color },
                opacity: { value: 1 }
            },
            vertexShader: arcaneMissileShader.vertexShader,
            fragmentShader: arcaneMissileShader.fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.copy(this.origin);
        this.mesh.lookAt(this.target);
        this.mesh.scale.set(this.startSize, this.startSize, this.startSize);
        scene.add(this.mesh);
    }

    update(deltaTime) {
        this.elapsed += deltaTime;
        const progress = THREE.MathUtils.clamp(this.elapsed / this.duration, 0, 1);

        const currentPosition = new THREE.Vector3().lerpVectors(this.origin, this.target, progress);
        this.mesh.position.copy(currentPosition);
        this.mesh.lookAt(currentPosition.clone().add(this.direction));

        const size = THREE.MathUtils.lerp(this.startSize, this.endSize, progress);
        this.mesh.scale.set(size, size, size);
        this.material.uniforms.opacity.value = 1 - progress;

        if (Math.random() < 0.7) {
            const drift = new THREE.Vector3(
                (Math.random() - 0.5) * 0.3,
                Math.random() * 0.4,
                (Math.random() - 0.5) * 0.3
            );
            const trailVelocity = this.direction.clone().multiplyScalar(-1.2).add(drift);
            gameState.particles.push(new SpriteParticle({
                position: currentPosition.clone(),
                velocity: trailVelocity,
                lifetime: 0.6,
                startSize: this.startSize * 0.6,
                endSize: this.endSize * 0.2,
                color: this.color.getHex(),
                endColor: 0xffffff,
                frameCount: 4,
                additive: true,
                verticalDrift: 0.3
            }));
        }

        if (progress >= 1) {
            scene.remove(this.mesh);
            this.geometry.dispose();
            this.material.dispose();
            if (typeof this.onComplete === 'function') {
                this.onComplete(this.target.clone());
            }
            return false;
        }

        return true;
    }
}

function createSpriteBurst(position, {
    particleCount = 12,
    color = 0xffffff,
    endColor = null,
    startSize = 1,
    endSize = 0.2,
    lifetime = 0.8,
    spread = 1.5,
    upward = 1.5,
    additive = true,
    frameCount = 4,
    verticalDrift = 0
} = {}) {
    const origin = position.clone();
    for (let i = 0; i < particleCount; i++) {
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * spread,
            Math.random() * upward,
            (Math.random() - 0.5) * spread
        );
        gameState.particles.push(new SpriteParticle({
            position: origin.clone(),
            velocity,
            lifetime,
            startSize,
            endSize,
            color,
            endColor: endColor ?? color,
            frameCount,
            additive,
            verticalDrift
        }));
    }
}

function createDirectionalSlashEffect(position, direction, config = {}) {
    const basePosition = position.clone();
    const dir = direction.clone().normalize();
    const orthogonal = new THREE.Vector3(-dir.z, 0, dir.x);
    const count = config.particleCount || 18;
    for (let i = 0; i < count; i++) {
        const sway = (i / count - 0.5) * (config.swirl ? 1.2 : 0.6);
        const velocity = dir.clone().multiplyScalar(2.2 + Math.random() * 0.6)
            .add(orthogonal.clone().multiplyScalar(sway))
            .add(new THREE.Vector3(0, Math.random() * 0.8, 0));
        gameState.particles.push(new SpriteParticle({
            position: basePosition.clone(),
            velocity,
            lifetime: config.lifetime || 0.6,
            startSize: config.startSize || 1.2,
            endSize: config.endSize || 0.2,
            color: config.color || 0xff5533,
            endColor: 0xfff7d6,
            frameCount: 5,
            additive: true
        }));
    }
}

function createStealthEntryEffect(position, config = {}) {
    const origin = position.clone();
    const count = config.particleCount || 24;
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const radius = 0.6 + Math.random() * 0.4;
        const offset = new THREE.Vector3(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 0.2,
            Math.sin(angle) * radius
        );
        const particlePos = origin.clone().add(offset);
        const velocity = offset.clone().multiplyScalar(-1.2).add(new THREE.Vector3(0, 1.2 + Math.random() * 0.6, 0));
        gameState.particles.push(new SpriteParticle({
            position: particlePos,
            velocity,
            lifetime: config.lifetime || 1.1,
            startSize: config.startSize || 2.2,
            endSize: config.endSize || 0.1,
            startOpacity: 0.9,
            endOpacity: 0,
            color: config.color || 0x4c2a6a,
            endColor: 0x000000,
            frameCount: 6,
            additive: true,
            verticalDrift: -0.3
        }));
    }
}

function createFinisherEffect(position, config = {}) {
    const origin = position.clone();
    createSpriteBurst(origin, {
        particleCount: config.particleCount || 28,
        color: config.color || 0xff3b2f,
        endColor: 0xfff2d4,
        startSize: config.startSize || 2,
        endSize: config.endSize || 0.3,
        lifetime: 1.1,
        spread: 2.2,
        upward: 2.8,
        additive: true,
        frameCount: 6
    });

    for (let i = 0; i < 8; i++) {
        const velocity = new THREE.Vector3(
            Math.cos((i / 8) * Math.PI * 2) * 1.5,
            3 + Math.random() * 1,
            Math.sin((i / 8) * Math.PI * 2) * 1.5
        );
        gameState.particles.push(new SpriteParticle({
            position: origin.clone(),
            velocity,
            lifetime: 1.3,
            startSize: (config.startSize || 2) * 0.8,
            endSize: (config.endSize || 0.3) * 0.5,
            color: config.color || 0xff3b2f,
            endColor: 0xffffff,
            frameCount: 4,
            additive: true
        }));
    }
}

function createSpeedTrailEffect(caster, config = {}) {
    if (!caster) return;
    const direction = caster.velocity && caster.velocity.lengthSq() > 0
        ? caster.velocity.clone().normalize()
        : new THREE.Vector3(Math.sin(caster.rotation || 0), 0, Math.cos(caster.rotation || 0));
    const basePosition = caster.position.clone().add(new THREE.Vector3(0, 0.5, 0));
    const count = config.particleCount || 12;
    for (let i = 0; i < count; i++) {
        const offset = direction.clone().multiplyScalar(-0.5 - Math.random() * 1.5)
            .add(new THREE.Vector3((Math.random() - 0.5) * 0.6, Math.random() * 0.4, (Math.random() - 0.5) * 0.6));
        const particlePos = basePosition.clone().add(offset);
        const velocity = direction.clone().multiplyScalar(-3).add(new THREE.Vector3(0, 1 + Math.random(), 0));
        gameState.particles.push(new SpriteParticle({
            position: particlePos,
            velocity,
            lifetime: config.lifetime || 0.7,
            startSize: config.startSize || 1.2,
            endSize: config.endSize || 0.1,
            color: config.color || 0xffc14d,
            endColor: 0xffffff,
            frameCount: 5,
            additive: true
        }));
    }
}

function createDefensiveShieldEffect(target, config = {}) {
    if (!target) return;
    const center = target.position.clone().add(new THREE.Vector3(0, 1, 0));
    const ringParticles = config.particleCount || 18;
    for (let i = 0; i < ringParticles; i++) {
        const angle = (i / ringParticles) * Math.PI * 2;
        const radius = 1 + Math.random() * 0.2;
        const offset = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle * 2) * 0.2, Math.sin(angle) * radius);
        const particlePos = center.clone().add(offset);
        const velocity = offset.clone().multiplyScalar(-0.6);
        gameState.particles.push(new SpriteParticle({
            position: particlePos,
            velocity,
            lifetime: config.lifetime || 1.2,
            startSize: config.startSize || 1.6,
            endSize: config.endSize || 0.8,
            startOpacity: 0.8,
            endOpacity: 0.1,
            color: config.color || 0x7dd0ff,
            endColor: 0xffffff,
            frameCount: 5,
            additive: true,
            verticalDrift: 0.1
        }));
    }
}

function createArcaneImpactEffect(position, config = {}) {
    const center = position.clone();
    createSpriteBurst(center, {
        particleCount: 12,
        color: config.color || 0xb695ff,
        endColor: 0xffffff,
        startSize: 1.2,
        endSize: 0.15,
        lifetime: 0.7,
        spread: 1.2,
        upward: 1.2,
        additive: true,
        frameCount: 5
    });
}

function createArcaneMissilesEffect(origin, {
    target,
    missiles = 3,
    color = 0xb695ff,
    startSize = 1.1,
    endSize = 0.25,
    missileInterval = 0.18,
    onImpact
} = {}) {
    if (!target) return;
    const targetPosition = target.clone();
    const originPosition = origin.clone();
    for (let i = 0; i < missiles; i++) {
        const delay = missileInterval * i;
        scheduleTimeout(() => {
            const projectile = new ArcaneMissileProjectile({
                origin: originPosition.clone(),
                target: targetPosition.clone(),
                duration: 0.8 + i * 0.05,
                color,
                startSize: startSize * (1 + Math.random() * 0.2),
                endSize,
                onComplete: impactPosition => {
                    createArcaneImpactEffect(impactPosition, { color });
                    if (typeof onImpact === 'function') {
                        onImpact(impactPosition.clone());
                    }
                }
            });
            gameState.particles.push(projectile);
        }, delay * 1000);
    }
}

function createFrostBurstEffect(position, config = {}) {
    createSpriteBurst(position, {
        particleCount: config.particleCount || 18,
        color: config.color || 0x7dd0ff,
        endColor: 0xffffff,
        startSize: config.startSize || 1.4,
        endSize: config.endSize || 0.2,
        lifetime: config.lifetime || 0.9,
        spread: 1.6,
        upward: 1.4,
        additive: true,
        frameCount: 5
    });
}

function createBlinkEffect(position, config = {}) {
    const base = position.clone();
    createSpriteBurst(base, {
        particleCount: config.particleCount || 16,
        color: config.color || 0xcbe5ff,
        endColor: 0xffffff,
        startSize: config.startSize || 1.6,
        endSize: config.endSize || 0.1,
        lifetime: config.lifetime || 0.6,
        spread: 1,
        upward: 1,
        additive: true,
        frameCount: 6
    });
}

function triggerVisualEffect(ability, context = {}) {
    if (!ability || !ability.visualEffect) {
        if (context.fallbackType) {
            createParticleEffect(context.position || new THREE.Vector3(), context.fallbackType, context);
        }
        return;
    }

    const effect = ability.visualEffect;
    const basePosition = (context.position && context.position.clone)
        ? context.position.clone()
        : context.position || (context.target && context.target.position ? context.target.position.clone() : (context.origin ? context.origin.clone() : new THREE.Vector3()));

    if (effect?.type) {
        pulseVolumetricLight(effect.type);
    }
    if (effect?.category) {
        pulseVolumetricLight(effect.category, 0.7);
    }
    if (context.fallbackType) {
        pulseVolumetricLight(context.fallbackType, 0.6);
    }

    switch (effect.type) {
        case 'stealth-entry':
            createStealthEntryEffect(basePosition, effect);
            break;
        case 'finisher':
            createFinisherEffect(basePosition, effect);
            break;
        case 'directional-slash': {
            const defaultForward = new THREE.Vector3(0, 0, 1);
            const casterPosition = context.caster && context.caster.position ? context.caster.position : null;
            const direction = context.direction ? context.direction.clone() : (context.targetPosition && casterPosition
                ? context.targetPosition.clone().sub(casterPosition).normalize()
                : defaultForward);
            createDirectionalSlashEffect(basePosition, direction, effect);
            break;
        }
        case 'speed-trail':
            createSpeedTrailEffect(context.caster, effect);
            break;
        case 'defensive-shield':
            createDefensiveShieldEffect(context.target || context.caster, effect);
            break;
        case 'shadow-strike': {
            const direction = context.direction ? context.direction.clone() : (context.caster && context.target ? context.target.position.clone().sub(context.caster.position).normalize() : new THREE.Vector3(0, 0, 1));
            createStealthEntryEffect(context.target ? context.target.position.clone() : basePosition, {
                ...effect,
                startSize: (effect.startSize || 1.6) * 0.8,
                particleCount: (effect.particleCount || 24) / 2
            });
            createDirectionalSlashEffect(basePosition, direction, effect);
            break;
        }
        case 'arcane-missiles': {
            const origin = context.origin || (context.caster ? context.caster.position.clone() : basePosition.clone());
            const target = context.targetPosition || (context.target ? context.target.position.clone() : basePosition.clone());
            const missileCount = context.missiles ?? effect.missiles ?? effect.particleCount;
            createArcaneMissilesEffect(origin, {
                ...effect,
                missiles: missileCount,
                target,
                onImpact: context.onImpact || effect.onImpact
            });
            break;
        }
        case 'frost-cast':
        case 'frost-field':
        case 'frost-cone':
            createFrostBurstEffect(basePosition, effect);
            break;
        case 'blink':
            createBlinkEffect(basePosition, effect);
            break;
        default:
            createSpriteBurst(basePosition, effect);
            break;
    }
}

function createParticleEffect(position, type, options = {}) {
    pulseVolumetricLight(type);

    switch (type) {
        case 'frost':
            createFrostBurstEffect(position, options);
            return;
        case 'damage':
            createSpriteBurst(position, { color: 0xff4433, endColor: 0xfff2d4, spread: 1.4, upward: 1.2 });
            return;
        case 'heal':
            createSpriteBurst(position, { color: 0x4cff7d, endColor: 0xffffff, spread: 1.2, upward: 1.6 });
            return;
        case 'stealth-entry':
            createStealthEntryEffect(position, options);
            return;
        case 'finisher':
            createFinisherEffect(position, options);
            return;
        case 'arcaneMissiles':
            createArcaneMissilesEffect(position, options);
            return;
        case 'arcaneImpact':
            createArcaneImpactEffect(position, options);
            return;
        default: {
            const particleCount = options.particleCount || 15;
            for (let i = 0; i < particleCount; i++) {
                const velocity = new THREE.Vector3(
                    (Math.random() - 0.5) * 5,
                    Math.random() * 5,
                    (Math.random() - 0.5) * 5
                );
                const color = type === 'damage' ? 0xff0000 :
                              type === 'heal' ? 0x00ff00 :
                              type === 'frost' ? 0x00bfff : 0xffff00;
                gameState.particles.push(new SimpleParticle(position, velocity, color, 1));
            }
        }
    }
}

// Combat log
function addCombatMessage(message, type) {
    const log = document.getElementById('combatLog');
    const messageDiv = document.createElement('div');
    messageDiv.className = `combat-message ${type}`;
    messageDiv.textContent = message;
    log.appendChild(messageDiv);
    log.scrollTop = log.scrollHeight;

    // Remove old messages
    while (log.children.length > 10) {
        log.removeChild(log.firstChild);
    }
}

// Input handling
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        e.preventDefault();
        if (!gameState.gameOver) {
            togglePause();
        }
        return;
    }

    if (gameState.isPaused || gameState.gameOver) {
        return;
    }

    if (e.key === 'Tab') {
        e.preventDefault();
        selectNextTarget();
        return;
    }

    const key = e.key.toLowerCase();
    gameState.input.keys[key] = true;

    // Ability usage
    if (e.key >= '1' && e.key <= '9') {
        const abilityIndex = parseInt(e.key, 10) - 1;
        if (abilityIndex < gameState.player.abilities.length) {
            usePlayerAbility(abilityIndex);
        }
    }
});

function bindAbilityClickHandlers() {
    const abilityElements = document.querySelectorAll('#abilities .ability');
    abilityElements.forEach(element => {
        element.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            const abilityIndex = parseInt(element.dataset.ability, 10);
            if (!Number.isNaN(abilityIndex)) {
                usePlayerAbility(abilityIndex);
            }
        });
    });
}

document.addEventListener('keyup', (e) => {
    gameState.input.keys[e.key.toLowerCase()] = false;
});

document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement === document.body) {
        gameState.camera.yaw -= e.movementX * 0.002;
        gameState.camera.pitch -= e.movementY * 0.002;
        gameState.camera.pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, gameState.camera.pitch));
    }
});

renderer.domElement.addEventListener('wheel', (event) => {
    event.preventDefault();

    const cameraState = gameState.camera;

    if (event.buttons === 4) {
        cameraState.targetDistance = THREE.MathUtils.clamp(
            cameraState.defaultDistance,
            cameraState.minDistance,
            cameraState.maxDistance
        );
    } else {
        const zoomDelta = event.deltaY * 0.01;
        cameraState.targetDistance = THREE.MathUtils.clamp(
            cameraState.targetDistance + zoomDelta,
            cameraState.minDistance,
            cameraState.maxDistance
        );
    }

    cameraState.targetHeight = cameraState.heightRatio * cameraState.targetDistance;
}, { passive: false });

document.addEventListener('click', (event) => {
    if (gameState.isPaused || gameState.gameOver) {
        return;
    }

    if (event.target.closest('.ability')) {
        return;
    }

    if (document.pointerLockElement !== document.body) {
        document.body.requestPointerLock();
    }
});

// Ability system
function usePlayerAbility(index) {
    if (gameState.gameOver || gameState.isPaused) return;

    const ability = gameState.player.abilities[index];
    if (!ability) return;

    const enemy = getCurrentEnemy();
    if (!enemy) {
        addCombatMessage('No target selected!', 'ability-use');
        return;
    }

    // Check cooldown
    if (ability.cooldown > 0) {
        addCombatMessage(`${ability.name} is on cooldown!`, 'ability-use');
        return;
    }

    // Check energy cost
    if (ability.cost > gameState.player.energy) {
        addCombatMessage('Not enough energy!', 'ability-use');
        return;
    }

    // Check special requirements
    if (ability.requiresStealth && !gameState.player.isStealthed) {
        addCombatMessage(`${ability.name} requires stealth!`, 'ability-use');
        return;
    }

    if (ability.requiresBehind) {
        const toEnemy = enemy.position.clone().sub(gameState.player.position).normalize();
        const enemyFacing = new THREE.Vector3(Math.sin(enemy.rotation), 0, Math.cos(enemy.rotation));
        const dotProduct = toEnemy.dot(enemyFacing);
        if (dotProduct < 0.5) {
            addCombatMessage('Must be behind target!', 'ability-use');
            return;
        }
    }

    const distance = gameState.player.position.distanceTo(enemy.position);

    // Execute ability
    switch (ability.name) {
        case 'Stealth':
            if (distance < 10) {
                addCombatMessage('Too close to enemy!', 'ability-use');
                return;
            }
            gameState.player.isStealthed = true;
            setPlayerBuff('stealth', {
                duration: ability.duration,
                icon: ability.icon,
                type: 'buff'
            });
            setPlayerAppearanceOpacity(0.3, true);
            addCombatMessage('You vanish into the shadows!', 'buff');
            triggerVisualEffect(ability, {
                caster: gameState.player,
                position: gameState.player.position.clone()
            });
            break;

        case 'Sprint':
            setPlayerBuff('sprint', {
                duration: ability.duration,
                icon: ability.icon,
                type: 'buff'
            });
            addCombatMessage('Sprint activated!', 'buff');
            triggerVisualEffect(ability, {
                caster: gameState.player,
                position: gameState.player.position.clone()
            });
            break;

        case 'Evasion':
            setPlayerBuff('evasion', {
                duration: ability.duration,
                icon: ability.icon,
                type: 'buff'
            });
            addCombatMessage('Evasion activated!', 'buff');
            triggerVisualEffect(ability, {
                caster: gameState.player,
                position: gameState.player.position.clone()
            });
            break;

        default:
            // Damage abilities
            if (distance > 5) {
                addCombatMessage('Too far from target!', 'ability-use');
                return;
            }

            const previousComboPoints = gameState.player.comboPoints || 0;
            let damage = ability.damage || 0;
            let comboPointsUsed = 0;

            if (ability.finisher) {
                comboPointsUsed = previousComboPoints;
                const bonusPerPoint = ability.damagePerCombo || 0;
                damage += comboPointsUsed * bonusPerPoint;
            }

            // Ambush and Backstab get bonus from stealth
            if ((ability.name === 'Ambush' || ability.name === 'Backstab') && gameState.player.isStealthed) {
                damage *= 1.5;
            }

            let damageDealt = damage;

            if (enemy.shield > 0) {
                const shieldDamage = Math.min(damageDealt, enemy.shield);
                enemy.shield -= shieldDamage;
                damageDealt -= shieldDamage;
                if (enemy.shield <= 0) {
                    addCombatMessage('Ice Barrier broken!', 'damage');
                }
            }

            damageDealt = Math.max(0, damageDealt);
            enemy.health -= damageDealt;
            const impactPosition = enemy.position.clone();
            const direction = impactPosition.clone().sub(gameState.player.position);
            if (direction.lengthSq() > 0) {
                direction.normalize();
            } else {
                direction.set(0, 0, 1);
            }
            triggerVisualEffect(ability, {
                caster: gameState.player,
                target: enemy,
                position: impactPosition,
                direction,
                targetPosition: impactPosition.clone(),
                fallbackType: 'damage'
            });
            if (ability.finisher && comboPointsUsed > 0) {
                addCombatMessage(
                    `${ability.name} consumes ${comboPointsUsed} combo point${comboPointsUsed === 1 ? '' : 's'} for ${Math.round(damageDealt)} damage!`,
                    'damage'
                );
            } else {
                addCombatMessage(`${ability.name} hits for ${Math.round(damageDealt)} damage!`, 'damage');
            }

            if (ability.finisher) {
                if (gameState.player.comboPoints !== 0) {
                    gameState.player.comboPoints = 0;
                }
            } else if (ability.buildsCombo) {
                const generated = ability.comboPointsGenerated ?? 1;
                const newComboPoints = Math.min(
                    gameState.player.maxComboPoints,
                    previousComboPoints + generated
                );
                gameState.player.comboPoints = newComboPoints;
            }

            // Break stealth on damage
            if (gameState.player.isStealthed) {
                removePlayerBuff('stealth');
            }
            break;
    }

    // Consume energy and set cooldown
    gameState.player.energy -= ability.cost;
    if (ability.maxCooldown) {
        ability.cooldown = ability.maxCooldown;
    }

    updateUI();

    const abilityElement = document.querySelector(`#abilities .ability[data-ability="${index}"]`);
    if (abilityElement) {
        abilityElement.classList.remove('activated');
        void abilityElement.offsetWidth;
        abilityElement.classList.add('activated');
        abilityElement.addEventListener('animationend', () => {
            abilityElement.classList.remove('activated');
        }, { once: true });
    }
}

// Enemy AI
function updateEnemyAI(deltaTime) {
    const enemy = getCurrentEnemy();
    if (!enemy) {
        hideEnemyCastBar();
        return;
    }

    if (enemy.health <= 0) {
        enemy.velocity.set(0, 0, 0);
        interruptEnemyCast('Dead');
        return;
    }

    if (gameState.gameOver) {
        interruptEnemyCast('Combat Ended');
        return;
    }

    enemy.detectCooldown = Math.max(0, (enemy.detectCooldown || 0) - deltaTime);
    if (typeof enemy.awareness !== 'number') enemy.awareness = 0;
    if (typeof enemy.searchTimer !== 'number') enemy.searchTimer = 0;
    if (typeof enemy.patrolAngle !== 'number') enemy.patrolAngle = 0;

    const toPlayerVector = gameState.player.position.clone().sub(enemy.position);
    const distanceToPlayer = toPlayerVector.length();
    const directionToPlayer = distanceToPlayer > 0 ? toPlayerVector.clone().normalize() : new THREE.Vector3(0, 0, 0);

    let playerVisible = !gameState.player.isStealthed;
    if (gameState.player.isStealthed) {
        const forward = new THREE.Vector3(Math.sin(enemy.rotation), 0, Math.cos(enemy.rotation));
        const dot = forward.dot(directionToPlayer);
        const angle = directionToPlayer.lengthSq() === 0 ? Math.PI : Math.acos(THREE.MathUtils.clamp(dot, -1, 1));
        const withinView = angle < Math.PI / 3;
        const closeEnough = distanceToPlayer < 4;

        if (closeEnough) {
            enemy.awareness = Math.min(1, enemy.awareness + deltaTime * 2);
        } else if (withinView && distanceToPlayer < 12) {
            enemy.awareness = Math.min(1, enemy.awareness + deltaTime);
        } else {
            enemy.awareness = Math.max(0, enemy.awareness - deltaTime * 0.5);
        }

        playerVisible = closeEnough || (withinView && enemy.awareness > 0.6);
        if (playerVisible) {
            enemy.lastKnownPlayerPos = gameState.player.position.clone();
        }
    } else {
        enemy.awareness = 1;
        playerVisible = true;
        enemy.lastKnownPlayerPos = gameState.player.position.clone();
        enemy.searchTimer = 0;
        enemy.patrolAngle = 0;
    }

    let targetDirection = null;
    let targetDistance = Infinity;

    if (playerVisible) {
        targetDirection = directionToPlayer.clone();
        targetDistance = distanceToPlayer;
        enemy.aiState = 'aggressive';
        enemy.searchTimer = 0;
        enemy.patrolAngle = 0;
    } else if (enemy.lastKnownPlayerPos) {
        const toLastKnown = enemy.lastKnownPlayerPos.clone().sub(enemy.position);
        targetDistance = toLastKnown.length();
        targetDirection = targetDistance > 0 ? toLastKnown.normalize() : null;
        enemy.aiState = 'searching';
    } else {
        enemy.aiState = 'alert';
    }

    if (targetDirection) {
        enemy.rotation = Math.atan2(targetDirection.x, targetDirection.z);
    }

    // Root duration
    if (enemy.isRooted) {
        if (enemy.isCasting) {
            interruptEnemyCast('Rooted');
        }
        enemy.rootDuration -= deltaTime;
        if (enemy.rootDuration <= 0) {
            enemy.isRooted = false;
        }
    }

    // Handle casting
    if (enemy.isCasting) {
        if (enemy.castCost > 0 && enemy.mana < enemy.castCost) {
            interruptEnemyCast('Out of Mana');
            return;
        }

        enemy.castTime -= deltaTime;

        if (enemy.castDuration > 0) {
            updateEnemyCastBarProgress(enemy.castTime);
        }

        if (enemy.castTime <= 0) {
            completeCast();
        }
        return;
    }

    // Ability usage logic
    const now = Date.now() / 1000;
    if (now - enemy.lastAbilityTime > 1) { // AI thinks every second

        if (gameState.player.isStealthed) {
            const coneOfCold = enemy.abilities[4];
            if (playerVisible && coneOfCold && coneOfCold.cooldown <= 0 && enemy.detectCooldown <= 0 && enemy.mana >= (coneOfCold.cost || 0)) {
                enemy.mana -= coneOfCold.cost || 0;
                coneOfCold.cooldown = coneOfCold.maxCooldown || 0;
                enemy.detectCooldown = 4;
                triggerVisualEffect(coneOfCold, {
                    caster: enemy,
                    position: enemy.position.clone().add(new THREE.Vector3(0, 1, 0)),
                    target: gameState.player
                });
                addCombatMessage(`${getEnemyName(enemy)} sweeps the area with Cone of Cold, revealing you!`, 'ability-use');
                removePlayerBuff('stealth');
                gameState.player.isStealthed = false;
                enemy.awareness = 1;
                enemy.lastKnownPlayerPos = gameState.player.position.clone();
            }
        } else {
            // Ice Barrier when low health
            if (enemy.health < 40 && enemy.abilities[3].cooldown <= 0 && enemy.mana >= 50) {
                enemy.shield = 40;
                enemy.mana -= 50;
                enemy.abilities[3].cooldown = enemy.abilities[3].maxCooldown;
                addCombatMessage(`${getEnemyName(enemy)} casts Ice Barrier!`, 'buff');
                triggerVisualEffect(enemy.abilities[3], {
                    caster: enemy,
                    target: enemy,
                    position: enemy.position.clone().add(new THREE.Vector3(0, 1, 0))
                });
            }
            // Frost Nova when player is close
            else if (playerVisible && distanceToPlayer < 5 && enemy.abilities[1].cooldown <= 0 && enemy.mana >= 40) {
                gameState.player.velocity.set(0, 0, 0);
                gameState.player.isRooted = true;
                gameState.player.rootDuration = 3;
                gameState.player.health -= 15;
                enemy.mana -= 40;
                enemy.abilities[1].cooldown = enemy.abilities[1].maxCooldown;
                triggerVisualEffect(enemy.abilities[1], {
                    caster: enemy,
                    target: gameState.player,
                    position: gameState.player.position.clone().add(new THREE.Vector3(0, 1, 0))
                });
                addCombatMessage(`${getEnemyName(enemy)} casts Frost Nova! You are frozen!`, 'damage');

                // Blink away after nova
                scheduleTimeout(() => {
                    if (enemy.abilities[2].cooldown <= 0 && enemy.mana >= 20) {
                        const blinkDirection = directionToPlayer.clone().multiplyScalar(-15);
                        enemy.position.add(blinkDirection);
                        enemy.mana -= 20;
                        enemy.abilities[2].cooldown = enemy.abilities[2].maxCooldown;
                        addCombatMessage(`${getEnemyName(enemy)} blinks away!`, 'ability-use');
                        triggerVisualEffect(enemy.abilities[2], {
                            caster: enemy,
                            position: enemy.position.clone().add(new THREE.Vector3(0, 1, 0))
                        });
                    }
                }, 100);
            }
            // Cone of Cold at mid range
            else if (playerVisible && distanceToPlayer < 8 && distanceToPlayer > 3 && enemy.abilities[4].cooldown <= 0 && enemy.mana >= 35) {
                gameState.player.health -= 25;
                enemy.mana -= 35;
                enemy.abilities[4].cooldown = enemy.abilities[4].maxCooldown;
                triggerVisualEffect(enemy.abilities[4], {
                    caster: enemy,
                    target: gameState.player,
                    position: gameState.player.position.clone().add(new THREE.Vector3(0, 1, 0))
                });
                addCombatMessage(`${getEnemyName(enemy)} casts Cone of Cold for 25 damage!`, 'damage');
            }
            // Arcane Missiles at long range
            else if (playerVisible && distanceToPlayer > 10 && enemy.abilities[5] && enemy.abilities[5].cooldown <= 0 && enemy.mana >= (enemy.abilities[5].cost || 0)) {
                const arcaneMissiles = enemy.abilities[5];
                enemy.mana -= arcaneMissiles.cost || 0;
                arcaneMissiles.cooldown = arcaneMissiles.maxCooldown || 0;
                addCombatMessage(`${getEnemyName(enemy)} launches Arcane Missiles!`, 'ability-use');
                const origin = enemy.position.clone().add(new THREE.Vector3(0, 1.2, 0));
                const targetPosition = gameState.player.position.clone().add(new THREE.Vector3(0, 1, 0));
                const missileDamage = arcaneMissiles.damage || 14;
                triggerVisualEffect(arcaneMissiles, {
                    caster: enemy,
                    origin,
                    target: gameState.player,
                    targetPosition,
                    missiles: arcaneMissiles.missiles,
                    onImpact: () => {
                        if (gameState.player.health <= 0) {
                            return;
                        }
                        gameState.player.health -= missileDamage;
                        addCombatMessage(`Arcane Missiles hits for ${missileDamage} damage!`, 'damage');
                    }
                });
            }
            // Frostbolt as default
            else if (playerVisible) {
                const frostbolt = enemy.abilities[0];
                if (frostbolt && enemy.mana >= (frostbolt.cost || 0) && frostbolt.castTime) {
                    enemy.isCasting = true;
                    enemy.castTime = frostbolt.castTime;
                    enemy.castDuration = frostbolt.castTime;
                    enemy.castCost = frostbolt.cost || 0;
                    enemy.currentCast = frostbolt.name;
                    showEnemyCastBar(frostbolt.name, frostbolt.castTime);
                    addCombatMessage(`${getEnemyName(enemy)} begins casting ${frostbolt.name}...`, 'ability-use');
                }
            }
        }

        enemy.lastAbilityTime = now;
    }

    // Movement
    if (!enemy.isRooted && !enemy.isCasting) {
        if (playerVisible && targetDirection) {
            if (distanceToPlayer > 20) {
                enemy.velocity = targetDirection.clone().multiplyScalar(3);
            } else if (distanceToPlayer < 8) {
                enemy.velocity = targetDirection.clone().multiplyScalar(-2);
            } else {
                const strafe = new THREE.Vector3(-targetDirection.z, 0, targetDirection.x);
                enemy.velocity = strafe.multiplyScalar(Math.sin(now * 2) * 2);
            }
        } else if (!playerVisible && enemy.lastKnownPlayerPos && targetDirection) {
            if (targetDistance > 1.5) {
                enemy.velocity = targetDirection.clone().multiplyScalar(2.5);
            } else {
                enemy.searchTimer += deltaTime;
                enemy.patrolAngle += deltaTime * 1.5;
                const patrolOffset = new THREE.Vector3(Math.cos(enemy.patrolAngle), 0, Math.sin(enemy.patrolAngle)).multiplyScalar(2);
                const patrolTarget = enemy.lastKnownPlayerPos.clone().add(patrolOffset);
                const toPatrol = patrolTarget.sub(enemy.position);
                if (toPatrol.lengthSq() > 0.01) {
                    enemy.velocity = toPatrol.normalize().multiplyScalar(1.5);
                    enemy.rotation = Math.atan2(enemy.velocity.x, enemy.velocity.z);
                } else {
                    enemy.velocity.set(0, 0, 0);
                }

                if (enemy.searchTimer > 6) {
                    enemy.lastKnownPlayerPos = null;
                    enemy.searchTimer = 0;
                    enemy.patrolAngle = 0;
                }
            }
        } else {
            enemy.velocity.multiplyScalar(0.8);
        }
    } else {
        enemy.velocity.set(0, 0, 0);
    }
}

function completeCast() {
    const enemy = getCurrentEnemy();
    if (!enemy) return;

    const finishedSpell = enemy.currentCast;
    const castCost = enemy.castCost || 0;
    enemy.isCasting = false;

    if (finishedSpell === 'Frostbolt') {
        // Check if player evaded
        if (gameState.player.buffs.has('evasion')) {
            addCombatMessage('Frostbolt missed! (Evasion)', 'buff');
        } else {
            const damage = 35;
            gameState.player.health -= damage;
            const manaCost = castCost > 0 ? castCost : 30;
            enemy.mana = Math.max(0, enemy.mana - manaCost);
            const frostboltAbility = enemy.abilities.find(ability => ability.name === 'Frostbolt');
            triggerVisualEffect(frostboltAbility, {
                caster: enemy,
                target: gameState.player,
                position: gameState.player.position.clone().add(new THREE.Vector3(0, 1, 0))
            });
            addCombatMessage(`Frostbolt hits for ${damage} damage!`, 'damage');

            // Slow effect
            setPlayerBuff('slow', {
                duration: 3,
                icon: '❄️',
                type: 'debuff'
            });
        }
    }

    enemy.castTime = 0;
    enemy.castDuration = 0;
    enemy.castCost = 0;
    enemy.currentCast = null;
    hideEnemyCastBar();
}

// Update functions
function updatePlayer(deltaTime) {
    const keys = gameState.input.keys;
    const hasSprint = gameState.player.buffs.has('sprint');
    const hasSlow = gameState.player.buffs.has('slow');
    const moveSpeed = hasSprint ? 15 : (hasSlow ? 5 : 8);

    // Movement
    if (gameState.player.isRooted) {
        gameState.player.velocity.x = 0;
        gameState.player.velocity.z = 0;
        gameState.player.rootDuration -= deltaTime;
        if (gameState.player.rootDuration <= 0) {
            gameState.player.isRooted = false;
            gameState.player.rootDuration = 0;
        }
    } else {
        let moveX = 0, moveZ = 0;
        if (keys['w']) moveZ = -1;
        if (keys['s']) moveZ = 1;
        if (keys['a']) moveX = -1;
        if (keys['d']) moveX = 1;

        if (moveX !== 0 || moveZ !== 0) {
            const moveDir = new THREE.Vector3(moveX, 0, moveZ).normalize();

            // Rotate movement based on camera yaw
            const rotatedX = moveDir.x * Math.cos(gameState.camera.yaw) - moveDir.z * Math.sin(gameState.camera.yaw);
            const rotatedZ = moveDir.x * Math.sin(gameState.camera.yaw) + moveDir.z * Math.cos(gameState.camera.yaw);

            gameState.player.velocity.x = rotatedX * moveSpeed;
            gameState.player.velocity.z = rotatedZ * moveSpeed;

            // Break stealth on movement
            if (gameState.player.isStealthed && (Math.abs(moveX) > 0 || Math.abs(moveZ) > 0)) {
                // Allow some movement in stealth but slower
                gameState.player.velocity.multiplyScalar(0.5);
            }
        } else {
            gameState.player.velocity.x *= 0.8;
            gameState.player.velocity.z *= 0.8;
        }
    }

    // Jump
    if (keys[' '] && Math.abs(gameState.player.velocity.y) < 0.1) {
        gameState.player.velocity.y = 8;
    }

    // Apply gravity
    gameState.player.velocity.y -= 20 * deltaTime;

    // Update position
    gameState.player.position.add(gameState.player.velocity.clone().multiplyScalar(deltaTime));

    // Ground collision
    if (gameState.player.position.y < 1) {
        gameState.player.position.y = 1;
        gameState.player.velocity.y = 0;
    }

    // Arena bounds
    const distFromCenter = Math.sqrt(gameState.player.position.x ** 2 + gameState.player.position.z ** 2);
    if (distFromCenter > 28) {
        const dir = new THREE.Vector3(gameState.player.position.x, 0, gameState.player.position.z).normalize();
        gameState.player.position.x = dir.x * 28;
        gameState.player.position.z = dir.z * 28;
    }

    // Update mesh
    playerMesh.position.copy(gameState.player.position);

    // Energy regeneration
    gameState.player.energy = Math.min(gameState.player.maxEnergy, gameState.player.energy + 20 * deltaTime);

    // Update buffs
    for (const [buffName, buffData] of gameState.player.buffs.entries()) {
        buffData.remaining -= deltaTime;
        if (buffData.remaining <= 0) {
            removePlayerBuff(buffName);
        }
    }

    // Update ability cooldowns
    gameState.player.abilities.forEach(ability => {
        if (ability.cooldown > 0) {
            ability.cooldown -= deltaTime;
            if (ability.cooldown < 0) ability.cooldown = 0;
        }
    });
}

function updateEnemy(deltaTime) {
    const enemy = getCurrentEnemy();
    if (!enemy) {
        enemyMesh.visible = false;
        return;
    }

    // Update position
    enemy.position.add(enemy.velocity.clone().multiplyScalar(deltaTime));

    // Arena bounds
    const distFromCenter = Math.sqrt(enemy.position.x ** 2 + enemy.position.z ** 2);
    if (distFromCenter > 28) {
        const dir = new THREE.Vector3(enemy.position.x, 0, enemy.position.z).normalize();
        enemy.position.x = dir.x * 28;
        enemy.position.z = dir.z * 28;
    }

    // Update mesh
    enemyMesh.visible = true;
    enemyMesh.position.copy(enemy.position);
    enemyMesh.rotation.y = enemy.rotation;

    // Mana regeneration
    enemy.mana = Math.min(enemy.maxMana, enemy.mana + 10 * deltaTime);

    // Update ability cooldowns
    enemy.abilities.forEach(ability => {
        if (ability.cooldown > 0) {
            ability.cooldown -= deltaTime;
            if (ability.cooldown < 0) ability.cooldown = 0;
        }
    });
}

function updateCamera(deltaTime) {
    // Third-person camera
    const cameraState = gameState.camera;
    const lerpFactor = 1 - Math.exp(-cameraState.zoomSpeed * deltaTime);

    cameraState.distance = THREE.MathUtils.lerp(
        cameraState.distance,
        cameraState.targetDistance,
        lerpFactor
    );

    cameraState.targetHeight = cameraState.heightRatio * cameraState.targetDistance;
    const desiredHeight = cameraState.targetHeight;
    cameraState.height = THREE.MathUtils.lerp(
        cameraState.height,
        desiredHeight,
        lerpFactor
    );

    const cameraOffset = new THREE.Vector3(
        Math.sin(cameraState.yaw) * cameraState.distance,
        cameraState.height + Math.sin(cameraState.pitch) * 10,
        Math.cos(cameraState.yaw) * cameraState.distance
    );

    camera.position.copy(gameState.player.position).add(cameraOffset);
    camera.lookAt(gameState.player.position.clone().add(new THREE.Vector3(0, 2, 0)));
}

function resetGameState() {
    clearAllTrackedTimeouts();
    hideEnemyCastBar();
    enemyCastBarUI.hideTimeout = null;

    gameState.gameOver = false;
    gameState.isPaused = false;
    gameState.outcome = null;
    gameState.overlayMessage = null;

    gameState.player.position.copy(initialPlayerState.position);
    gameState.player.rotation = initialPlayerState.rotation;
    gameState.player.velocity.set(0, 0, 0);
    gameState.player.maxHealth = initialPlayerState.maxHealth;
    gameState.player.health = initialPlayerState.maxHealth;
    gameState.player.maxEnergy = initialPlayerState.maxEnergy;
    gameState.player.energy = initialPlayerState.maxEnergy;
    gameState.player.comboPoints = initialPlayerState.comboPoints;
    gameState.player.isStealthed = initialPlayerState.isStealthed;
    gameState.player.isRooted = initialPlayerState.isRooted;
    gameState.player.rootDuration = initialPlayerState.rootDuration;
    gameState.player.inCombat = initialPlayerState.inCombat;
    gameState.player.buffs = new Map();
    gameState.player.appearanceSet = initialPlayerState.appearanceSet;
    applyPlayerAppearance();

    gameState.player.abilities.forEach(ability => {
        ability.cooldown = 0;
    });

    setPlayerAppearanceOpacity(1, false);

    playerMesh.position.copy(gameState.player.position);
    playerMesh.rotation.y = gameState.player.rotation;

    const comboContainer = document.getElementById('comboPoints');
    if (comboContainer) {
        comboContainer.classList.remove('combo-change');
        if (comboContainer._comboTimeout) {
            cancelTrackedTimeout(comboContainer._comboTimeout);
            comboContainer._comboTimeout = null;
        }
        delete comboContainer.dataset.points;
        comboContainer.innerHTML = '';
    }

    gameState.enemies.forEach((enemy, index) => {
        const initialEnemy = initialEnemyStates[index];
        if (!initialEnemy) return;

        enemy.position.copy(initialEnemy.position);
        enemy.rotation = initialEnemy.rotation;
        if (enemy.velocity) {
            enemy.velocity.set(0, 0, 0);
        } else {
            enemy.velocity = new THREE.Vector3(0, 0, 0);
        }
        enemy.health = initialEnemy.maxHealth;
        enemy.maxHealth = initialEnemy.maxHealth;
        enemy.mana = initialEnemy.maxMana;
        enemy.maxMana = initialEnemy.maxMana;
        enemy.shield = 0;
        enemy.isCasting = false;
        enemy.castTime = 0;
        enemy.castDuration = 0;
        enemy.castCost = 0;
        enemy.currentCast = null;
        enemy.isRooted = false;
        enemy.rootDuration = 0;
        enemy.appearanceSet = initialEnemy.appearanceSet;
        enemy.aiState = initialEnemy.aiState;
        enemy.awareness = initialEnemy.awareness;
        enemy.detectCooldown = initialEnemy.detectCooldown;
        enemy.searchTimer = initialEnemy.searchTimer;
        enemy.patrolAngle = initialEnemy.patrolAngle;
        enemy.lastAbilityTime = 0;
        enemy.lastKnownPlayerPos = null;
        enemy.abilities.forEach(ability => {
            ability.cooldown = 0;
        });
    });

    if (gameState.enemies.length > 0) {
        const firstEnemy = gameState.enemies[0];
        enemyMesh.visible = true;
        enemyMesh.position.copy(firstEnemy.position);
        enemyMesh.rotation.y = firstEnemy.rotation;
        applyEnemyAppearance(firstEnemy);
        updateEnemySkinOptions(firstEnemy);
    }

    updateSkinSelectors();

    gameState.currentTarget = 0;
    updateTargetIndicator();

    if (gameState.particles.length) {
        gameState.particles.forEach(particle => {
            if (particle?.mesh) {
                scene.remove(particle.mesh);
            }
        });
        gameState.particles = [];
    }

    gameState.input.keys = {};

    const combatLog = document.getElementById('combatLog');
    if (combatLog) {
        combatLog.innerHTML = '';
    }

    const status = document.getElementById('gameStatus');
    if (status) {
        status.style.display = 'none';
        status.textContent = '';
    }

    Object.assign(gameState.camera, {
        pitch: initialCameraState.pitch,
        yaw: initialCameraState.yaw,
        distance: initialCameraState.distance,
        targetDistance: initialCameraState.targetDistance,
        minDistance: initialCameraState.minDistance,
        maxDistance: initialCameraState.maxDistance,
        zoomSpeed: initialCameraState.zoomSpeed,
        height: initialCameraState.height,
        targetHeight: initialCameraState.targetHeight,
        heightRatio: initialCameraState.heightRatio,
        defaultDistance: initialCameraState.defaultDistance
    });

    gameState.camera.targetHeight = gameState.camera.heightRatio * gameState.camera.targetDistance;

    lastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

    updateCamera(0.016);

    addCombatMessage('Duel begins!', 'buff');
    addCombatMessage('Click to capture mouse', 'ability-use');

    updateUI();
}

function updateUI() {
    // Player health
    const playerHealthBar = document.querySelector('#playerHealth .health-bar');
    const playerHealthPercent = Math.max(0, gameState.player.health / gameState.player.maxHealth * 100);
    playerHealthBar.style.width = playerHealthPercent + '%';
    document.getElementById('playerHpText').textContent =
        `${Math.max(0, Math.round(gameState.player.health))}/${gameState.player.maxHealth}`;

    // Player energy
    const playerEnergyBar = document.querySelector('#playerEnergy .energy-bar');
    const playerEnergyPercent = gameState.player.energy / gameState.player.maxEnergy * 100;
    playerEnergyBar.style.width = playerEnergyPercent + '%';
    document.getElementById('playerEnergyText').textContent =
        `${Math.round(gameState.player.energy)}/${gameState.player.maxEnergy}`;

    // Combo points
    const comboContainer = document.getElementById('comboPoints');
    if (comboContainer) {
        const maxPoints = gameState.player.maxComboPoints || 0;
        const currentPoints = Math.min(Math.max(0, gameState.player.comboPoints || 0), maxPoints);
        if (comboContainer.childElementCount !== maxPoints) {
            comboContainer.innerHTML = '';
            for (let i = 0; i < maxPoints; i++) {
                const pip = document.createElement('div');
                pip.className = 'combo-point';
                comboContainer.appendChild(pip);
            }
        }

        const pips = comboContainer.querySelectorAll('.combo-point');
        pips.forEach((pip, index) => {
            if (index < currentPoints) {
                pip.classList.add('active');
            } else {
                pip.classList.remove('active');
            }
        });

        comboContainer.style.display = maxPoints > 0 ? 'flex' : 'none';

        const previousPoints = comboContainer.dataset.points;
        const currentPointsStr = String(currentPoints);
        if (previousPoints !== currentPointsStr) {
            comboContainer.dataset.points = currentPointsStr;
            comboContainer.classList.remove('combo-change');
            void comboContainer.offsetWidth;
            comboContainer.classList.add('combo-change');
            if (comboContainer._comboTimeout) {
                cancelTrackedTimeout(comboContainer._comboTimeout);
                comboContainer._comboTimeout = null;
            }
            comboContainer._comboTimeout = scheduleTimeout(() => {
                comboContainer.classList.remove('combo-change');
                comboContainer._comboTimeout = null;
            }, 250);
        }
    }

    // Enemy health
    const enemyHealthBar = document.querySelector('#enemyHealth .health-bar');
    const enemy = getCurrentEnemy();
    const enemyHealthPercent = enemy ? Math.max(0, enemy.health / enemy.maxHealth * 100) : 0;
    enemyHealthBar.style.width = enemyHealthPercent + '%';
    document.getElementById('enemyHpText').textContent = enemy
        ? `${Math.max(0, Math.round(enemy.health))}/${enemy.maxHealth}`
        : '0/0';

    // Enemy mana
    const enemyManaBar = document.querySelector('#enemyMana .mana-bar');
    const enemyManaPercent = enemy ? enemy.mana / enemy.maxMana * 100 : 0;
    enemyManaBar.style.width = enemyManaPercent + '%';
    document.getElementById('enemyManaText').textContent = enemy
        ? `${Math.round(enemy.mana)}/${enemy.maxMana}`
        : '0/0';

    updateTargetIndicator();

    // Player buffs
    const buffContainer = document.getElementById('playerBuffs');
    if (buffContainer) {
        buffContainer.innerHTML = '';
        gameState.player.buffs.forEach((buffData, buffName) => {
            const buffElement = document.createElement('div');
            const buffTypeClass = buffData.type === 'debuff' ? 'debuff' : 'buff';
            buffElement.className = `buff-icon ${buffTypeClass}`;
            buffElement.textContent = buffData.icon || '★';
            buffElement.title = buffName.charAt(0).toUpperCase() + buffName.slice(1);

            const timer = document.createElement('div');
            timer.className = 'buff-timer';
            const remaining = Math.max(0, buffData.remaining);
            timer.textContent = Math.ceil(remaining).toString();
            buffElement.appendChild(timer);

            buffContainer.appendChild(buffElement);
        });
    }

    // Update ability cooldowns
    const abilityElements = document.querySelectorAll('.ability');
    abilityElements.forEach((element, index) => {
        const ability = gameState.player.abilities[index];
        if (!ability) return;

        const tooltip = element.querySelector('.ability-tooltip');
        if (tooltip) {
            const remaining = tooltip.querySelector('.ability-tooltip-remaining');
            if (remaining) {
                remaining.textContent = ability.cooldown > 0
                    ? `Remaining cooldown: ${ability.cooldown.toFixed(1)}s`
                    : 'Ready';
            }
        }

        // Remove old cooldown overlay
        const slot = element.querySelector('.ability-slot') || element;
        const oldOverlay = slot.querySelector('.cooldown-overlay');
        if (oldOverlay) oldOverlay.remove();

        if (ability.cooldown > 0) {
            element.classList.add('on-cooldown');
            const overlay = document.createElement('div');
            overlay.className = 'cooldown-overlay';
            overlay.textContent = Math.ceil(ability.cooldown);
            slot.appendChild(overlay);
        } else {
            element.classList.remove('on-cooldown');
        }
    });

    const status = document.getElementById('gameStatus');
    if (status) {
        status.style.display = 'none';
        status.textContent = '';
    }

    if (gameState.player.health <= 0 && !gameState.gameOver) {
        gameState.gameOver = true;
        gameState.outcome = 'defeat';
        gameState.overlayMessage = {
            title: 'Defeat',
            subtitle: 'You were defeated. Click restart to try again.'
        };
        gameState.input.keys = {};
        gameState.player.velocity.set(0, 0, 0);
        gameState.enemies.forEach(enemyState => {
            if (enemyState.velocity) {
                enemyState.velocity.set(0, 0, 0);
            }
        });
        interruptEnemyCast('Combat Ended');
        hideEnemyCastBar();
    } else if (!gameState.gameOver) {
        const allEnemiesDefeated = gameState.enemies.length > 0 &&
            gameState.enemies.every(enemyState => enemyState.health <= 0);

        if (allEnemiesDefeated) {
            gameState.gameOver = true;
            gameState.outcome = 'victory';
            gameState.overlayMessage = {
                title: 'Victory!',
                subtitle: 'All enemies defeated. Click restart to duel again.'
            };
            gameState.input.keys = {};
            gameState.player.velocity.set(0, 0, 0);
            gameState.enemies.forEach(enemyState => {
                if (enemyState.velocity) {
                    enemyState.velocity.set(0, 0, 0);
                }
            });
            interruptEnemyCast('Combat Ended');
            hideEnemyCastBar();
        } else {
            gameState.overlayMessage = null;
            gameState.outcome = null;
        }
    }

    updateOverlay();
}

// Game loop
let lastTime = 0;
function animate(currentTime) {
    requestAnimationFrame(animate);

    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    const effectDelta = effectClock.getDelta();

    if (!gameState.isPaused) {
        if (!gameState.gameOver) {
            updatePlayer(deltaTime);
            updateEnemy(deltaTime);
            updateEnemyAI(deltaTime);
        }

        // Update particles
        gameState.particles = gameState.particles.filter(particle => particle.update(effectDelta));

        updateCamera(deltaTime);
    }

    updateEnvironmentEffects(effectDelta);

    updateUI();

    composer.render();
}

// Handle window resize
function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    composer.setSize(width, height);
    composer.setPixelRatio(window.devicePixelRatio || 1);
    ssaoPass.setSize(width, height);
    bloomPass.setSize(width, height);
}

window.addEventListener('resize', onWindowResize);

// UI initialization
initializeAbilityUI();
initializeAppearanceSelectors();
updateTargetIndicator();

// Start messages
addCombatMessage('Duel begins!', 'buff');
addCombatMessage('Click to capture mouse', 'ability-use');

// Start game
animate(0);

