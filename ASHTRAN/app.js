/**
 * Weathern't™ — WEATHER DETECTOR PRO MAX ULTRA
 * High-performance satirical meteorological platform.
 */

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // AUDIO SYNTHESIZER (Web Audio API - zero external dependencies)
    // -------------------------------------------------------------------------
    let audioCtx = null;
    let soundEnabled = true;

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playSound(type) {
        if (!soundEnabled) return;
        try {
            initAudio();
            if (!audioCtx) return;

            const now = audioCtx.currentTime;

            if (type === 'beep') {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(587.33, now); // D5
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.15);
            } else if (type === 'panic') {
                // Dramatic minor dissonant chord
                [220, 233.08, 311.13].forEach((freq) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(freq, now);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now);
                    osc.stop(now + 0.6);
                });
            } else if (type === 'rain') {
                // High pitch bloop
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(1200 + Math.random() * 400, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (type === 'wind') {
                // Low oscillating rumble
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(90, now);
                osc.frequency.linearRampToValueAtTime(160, now + 0.25);
                osc.frequency.linearRampToValueAtTime(70, now + 0.5);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.55);
            } else if (type === 'error') {
                // Buzzer sound
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(140, now);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.35);
            } else if (type === 'success') {
                // Cheerful corporate chime
                [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + i * 0.08);
                    gain.gain.setValueAtTime(0.09, now + i * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now + i * 0.08);
                    osc.stop(now + i * 0.08 + 0.25);
                });
            }
        } catch (e) {
            console.warn('Audio contextual error ignored:', e);
        }
    }

    // -------------------------------------------------------------------------
    // DOM REFERENCES
    // -------------------------------------------------------------------------
    const locationInput = document.getElementById('locationInput');
    const clearInputBtn = document.getElementById('clearInputBtn');
    const detectWeatherBtn = document.getElementById('detectWeatherBtn');
    const askSkyBtn = document.getElementById('askSkyBtn');
    const panicBtn = document.getElementById('panicBtn');
    const panicBtnText = document.getElementById('panicBtnText');
    const panicFlashScreen = document.getElementById('panicFlashScreen');

    const loadingSection = document.getElementById('loadingSection');
    const customProgressBar = document.getElementById('customProgressBar');
    const loadingPercent = document.getElementById('loadingPercent');
    const loadingStatusText = document.getElementById('loadingStatusText');
    const loadingStageTitle = document.getElementById('loadingStageTitle');
    const loadingStageSub = document.getElementById('loadingStageSub');

    const resultsSection = document.getElementById('resultsSection');
    const interpretedLocationTag = document.getElementById('interpretedLocationTag');
    const mainResultHeadline = document.getElementById('mainResultHeadline');
    const mainResultSubtext = document.getElementById('mainResultSubtext');

    // Stats
    const valTemperature = document.getElementById('valTemperature');
    const valHumidity = document.getElementById('valHumidity');
    const valWind = document.getElementById('valWind');
    const valVisibility = document.getElementById('valVisibility');
    const valRain = document.getElementById('valRain');
    const valUV = document.getElementById('valUV');
    const valConfidence = document.getElementById('valConfidence');

    // Contradiction & Refresh
    const refreshAtmoBtn = document.getElementById('refreshAtmoBtn');
    const refreshFeedbackText = document.getElementById('refreshFeedbackText');

    // Tools
    const askCloudBtn = document.getElementById('askCloudBtn');
    const cloudOpinionText = document.getElementById('cloudOpinionText');
    const cloudResponseLog = document.getElementById('cloudResponseLog');

    const calibrateTempBtn = document.getElementById('calibrateTempBtn');
    const tempVibesText = document.getElementById('tempVibesText');
    const tempCalibrateLog = document.getElementById('tempCalibrateLog');

    const locateWindBtn = document.getElementById('locateWindBtn');
    const windLocateText = document.getElementById('windLocateText');
    const windResultLog = document.getElementById('windResultLog');
    const compassNeedle = document.getElementById('compassNeedle');

    const isItRainingBtn = document.getElementById('isItRainingBtn');
    const rainDetectorText = document.getElementById('rainDetectorText');
    const rainResponseLog = document.getElementById('rainResponseLog');

    // AI Box
    const reGenAiInsight = document.getElementById('reGenAiInsight');
    const aiInsightQuote = document.getElementById('aiInsightQuote');

    // Map
    const weatherMapCanvas = document.getElementById('weatherMapCanvas');
    const mapCenterBtn = document.getElementById('mapCenterBtn');
    const mapOceanBtn = document.getElementById('mapOceanBtn');
    const mapZoomInBtn = document.getElementById('mapZoomInBtn');
    const mapZoomOutBtn = document.getElementById('mapZoomOutBtn');
    const mapCoords = document.getElementById('mapCoords');
    const mapPoiBanner = document.getElementById('mapPoiBanner');
    const poiBannerTitle = document.getElementById('poiBannerTitle');
    const poiBannerDesc = document.getElementById('poiBannerDesc');
    const closePoiBanner = document.getElementById('closePoiBanner');
    const pinUser = document.getElementById('pinUser');

    // 7 Day
    const moreAccurateBtn = document.getElementById('moreAccurateBtn');
    const accuracyModalBackdrop = document.getElementById('accuracyModalBackdrop');
    const closeAccuracyModal = document.getElementById('closeAccuracyModal');

    // Sky Modal
    const skyModalBackdrop = document.getElementById('skyModalBackdrop');
    const closeSkyModal = document.getElementById('closeSkyModal');
    const apologizeSkyBtn = document.getElementById('apologizeSkyBtn');
    const bribeSkyBtn = document.getElementById('bribeSkyBtn');
    const skyVerdict = document.getElementById('skyVerdict');
    const skyElaboration = document.getElementById('skyElaboration');

    // Settings Modal
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModalBackdrop = document.getElementById('settingsModalBackdrop');
    const closeSettingsModal = document.getElementById('closeSettingsModal');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const resetWorseDefaultsBtn = document.getElementById('resetWorseDefaultsBtn');
    const unitVibePreview = document.getElementById('unitVibePreview');

    // Error Rack
    const errorBannerDisplay = document.getElementById('errorBannerDisplay');
    const errorTitle = document.getElementById('errorTitle');
    const errorSubtitle = document.getElementById('errorSubtitle');
    const dismissErrBtn = document.getElementById('dismissErrBtn');

    // Header toggles
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const soundIcon = document.getElementById('soundIcon');
    const soundLabel = document.getElementById('soundLabel');
    const themeWorseBtn = document.getElementById('themeWorseBtn');
    const streakBadge = document.getElementById('streakBadge');

    // Random Spontaneous Sync
    const randomSyncOverlay = document.getElementById('randomSyncOverlay');
    const syncProgressFill = document.getElementById('syncProgressFill');
    const cancelSyncBtn = document.getElementById('cancelSyncBtn');

    // Toast stack
    const toastStack = document.getElementById('toastStack');

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------
    let refreshCount = 0;
    let rainQueryCount = 0;
    let cloudAskCount = 0;
    let streakCoins = 3;
    let currentUnits = 'vibes'; // vibes, celsius, fahrenheit
    let isCalibratedWarmer = false;

    // -------------------------------------------------------------------------
    // TOAST NOTIFICATIONS GENERATOR
    // -------------------------------------------------------------------------
    const RANDOM_ALERTS = [
        { title: 'WEATHER ALERT', msg: 'The sky is currently above you.', severe: false, icon: '🔔' },
        { title: 'IMPORTANT', msg: 'Wind has been detected somewhere nearby.', severe: false, icon: '🔔' },
        { title: 'SEVERE WEATHER WARNING', msg: 'It may become slightly different outside.', severe: true, icon: '⚠️' },
        { title: 'BREAKING', msg: 'Clouds continue to exist.', severe: false, icon: '🔔' },
        { title: 'ATMOSPHERIC ADVISORY', msg: 'Puddles are merely ground-based water accumulations.', severe: false, icon: '💧' },
        { title: 'GRAVITATIONAL NOTICE', msg: 'Objects continue falling at 9.8 m/s² unless held.', severe: false, icon: '🍏' },
        { title: 'BAROMETRIC UPDATE', msg: 'Pressure is mounting. Mostly at your workplace.', severe: true, icon: '📈' },
        { title: 'OXYGEN CONFIRMATION', msg: 'Atmospheric oxygen at 20.9%. Inhale responsibly.', severe: false, icon: '🫁' }
    ];

    function showToast(title, message, isSevere = false, icon = '🔔') {
        playSound(isSevere ? 'error' : 'beep');
        const toast = document.createElement('div');
        toast.className = `toast-item ${isSevere ? 'severe' : ''}`;
        toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
    `;
        toastStack.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(50px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 4500);
    }

    // Periodic random toast trigger
    setInterval(() => {
        if (Math.random() > 0.45) {
            const alert = RANDOM_ALERTS[Math.floor(Math.random() * RANDOM_ALERTS.length)];
            showToast(alert.title, alert.msg, alert.severe, alert.icon);
        }
    }, 22000);

    // Initial greeting toast
    setTimeout(() => {
        showToast('WEATHER ALERT', 'The sky is currently above you.', false, '🔔');
    }, 2000);

    // -------------------------------------------------------------------------
    // LOCATION MISUNDERSTANDING LOGIC
    // -------------------------------------------------------------------------
    const MISINTERPRETATIONS = {
        mumbai: { parsed: "Mom's pie (High humidity due to steam)", match: "11.4%" },
        mars: { parsed: "Local candy bar aisle (Dusty)", match: "8.2%" },
        "my backyard": { parsed: "Sovereignty disputed by local raccoons", match: "4.1%" },
        "existential dread": { parsed: "Tuesday afternoon in suburbia", match: "99.1%" },
        "what will the weather be tomorrow?": { parsed: "Philosophical inquiry into temporal moisture", match: "14.0%" },
        "under my bed": { parsed: "Dust bunny biosphere (Sub-zero visibility)", match: "2.3%" },
        "paris, texas": { parsed: "Eiffel Tower with a cowboy hat", match: "22.7%" }
    };

    function getMisinterpretation(rawInput) {
        const clean = (rawInput || '').trim().toLowerCase();
        if (MISINTERPRETATIONS[clean]) {
            return MISINTERPRETATIONS[clean];
        }
        if (!clean) {
            return { parsed: "Unspecified void of nothingness", match: "0.01%" };
        }
        // Generate wacky phonetic mangling
        const prefixes = ["North", "Sub-tropical", "Downtown", "Old", "Greater"];
        const suffixes = ["Ville", "Oasis", "Intersection", "Puddle", "Station"];
        const scrambled = clean.split('').reverse().slice(0, 5).join('');
        const randomPick = prefixes[Math.floor(Math.random() * prefixes.length)] + " " +
            scrambled.charAt(0).toUpperCase() + scrambled.slice(1) +
            suffixes[Math.floor(Math.random() * suffixes.length)];
        const matchVal = (Math.random() * 18 + 1).toFixed(1) + "%";
        return { parsed: `"${randomPick}" (Heavily distorted)`, match: matchVal };
    }

    // -------------------------------------------------------------------------
    // PANIC BUTTON WORKFLOW
    // Requirement:
    // Changes text to: "Panic acknowledged."
    // After 2 seconds: "Panic has been outsourced."
    // -------------------------------------------------------------------------
    let panicTimeout1 = null;
    let panicTimeout2 = null;

    panicBtn.addEventListener('click', function () {
        playSound('panic');
        panicFlashScreen.classList.add('active');
        setTimeout(() => panicFlashScreen.classList.remove('active'), 400);

        panicBtnText.textContent = "Panic acknowledged.";
        panicBtn.style.background = "linear-gradient(135deg, #b91c1c, #7f1d1d)";

        clearTimeout(panicTimeout1);
        clearTimeout(panicTimeout2);

        panicTimeout1 = setTimeout(() => {
            panicBtnText.textContent = "Panic has been outsourced.";
            showToast('HR NOTICE', 'Your panic has been assigned to ticket #PANIC-8841.', false, '💼');
        }, 2000);

        panicTimeout2 = setTimeout(() => {
            panicBtnText.textContent = "PANIC";
            panicBtn.style.background = "";
        }, 7000);
    });

    // -------------------------------------------------------------------------
    // WEATHER DETECTION & UNNECESSARILY LONG LOADING SEQUENCE
    // Requirement:
    // Display a loading animation for an unnecessarily long time.
    // Then show:
    // WEATHER DETECTION COMPLETE ✅
    // Large result:
    // "Tomorrow's weather cannot be detected at this time because the weather is currently having dinner at your location."
    // Underneath:
    // “We attempted to contact it. It left us on read.”
    // Completely unrelated stats:
    // Temperature: probably
    // Humidity: moist-ish
    // Wind: moving
    // Visibility: you'll know when you see it
    // Chance of rain: financially complicated
    // UV Index: UV
    // Weather confidence: 42% confident that weather exists
    // -------------------------------------------------------------------------
    const LOADING_STAGES = [
        { pct: 15, title: "Contacting troposphere...", sub: "Routing packets through high-altitude vapor." },
        { pct: 34, title: "Negotiating diplomatic clearance with cumulonimbus cloud...", sub: "Cloud legal team is reviewing our request." },
        { pct: 54, title: "Consulting local neighborhood seagull...", sub: "Seagull demanded french fries as payment." },
        { pct: 72, title: "Calibrating thermal vibe sensors...", sub: "Converting ambient optimism to Kelvin." },
        { pct: 89, title: "Running atmospheric regression on toaster...", sub: "Almost finished with completely unrelated math." },
        { pct: 98, title: "Detecting user impatience...", sub: "Impatience detected at critical mass." },
        { pct: 100, title: "Finalizing scientifically unsound conclusion...", sub: "Ready to deceive." }
    ];

    function runWeatherDetection() {
        playSound('beep');
        const inputVal = locationInput.value;
        const misinfo = getMisinterpretation(inputVal);

        resultsSection.style.display = 'none';
        loadingSection.style.display = 'flex';
        loadingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

        let currentStage = 0;

        function nextStage() {
            if (currentStage >= LOADING_STAGES.length) {
                // Complete!
                setTimeout(() => {
                    loadingSection.style.display = 'none';
                    renderWeatherResults(misinfo);
                }, 500);
                return;
            }

            const stage = LOADING_STAGES[currentStage];
            customProgressBar.style.width = stage.pct + '%';
            loadingPercent.textContent = stage.pct + '%';
            loadingStageTitle.textContent = stage.title;
            loadingStageSub.textContent = stage.sub;
            loadingStatusText.textContent = `Stage ${currentStage + 1} of 7: Processing...`;

            playSound('beep');
            currentStage++;

            // Each stage takes 450ms - 650ms for an unnecessarily long ~3.5s loading time
            setTimeout(nextStage, 480 + Math.random() * 200);
        }

        nextStage();
    }

    function renderWeatherResults(misinfo) {
        playSound('success');

        // Display interpreted tag
        interpretedLocationTag.innerHTML = `Location parsed as: <strong>"${misinfo.parsed}"</strong> (Match Quality: ${misinfo.match})`;

        // Explicit exact requirements from prompt:
        mainResultHeadline.textContent = "Tomorrow's weather cannot be detected at this time because the weather is currently having dinner at your location.";
        mainResultSubtext.textContent = "“We attempted to contact it. It left us on read.”";

        // Set stats based on units
        applyUnitsToStats();

        resultsSection.style.display = 'flex';
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        showToast('COMPLETE', 'Atmosphere interrogation concluded with zero usable data.', false, '✅');
    }

    function applyUnitsToStats() {
        if (currentUnits === 'vibes') {
            valTemperature.textContent = "probably (kinda warm)";
        } else if (currentUnits === 'celsius') {
            valTemperature.textContent = "probably (19.4°C ± 90°)";
        } else {
            valTemperature.textContent = "probably (68°F ± 150°)";
        }

        valHumidity.textContent = "moist-ish";
        valWind.textContent = "moving";
        valVisibility.textContent = "you'll know when you see it";
        valRain.textContent = "financially complicated";
        valUV.textContent = "UV";
        valConfidence.textContent = "42% confident that weather exists";
    }

    detectWeatherBtn.addEventListener('click', runWeatherDetection);

    // Quick chips
    document.querySelectorAll('.chip-btn').forEach((btn) => {
        btn.addEventListener('click', function () {
            playSound('beep');
            locationInput.value = this.getAttribute('data-val');
            runWeatherDetection();
        });
    });

    clearInputBtn.addEventListener('click', () => {
        locationInput.value = '';
        locationInput.focus();
    });

    locationInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            runWeatherDetection();
        }
    });

    // -------------------------------------------------------------------------
    // REFRESH ATMOSPHERE (Actively contradictory reactions)
    // Requirement:
    // If the user refreshes:
    // "Weather changed because you refreshed."
    // If they refresh again:
    // "Please stop manipulating the atmosphere."
    // -------------------------------------------------------------------------
    const REFRESH_RESPONSES = [
        "Weather changed because you refreshed.",
        "Please stop manipulating the atmosphere.",
        "The ozone layer has officially filed a grievance with HR.",
        "Wind shifted 180° out of pure and unfiltered spite.",
        "You have disturbed the slumber of the barometric pressure deity.",
        "Stop clicking! You are causing localized micro-monsoons in your kitchen.",
        "Atmospheric corruption level 99%. Please step outdoors to hard-reboot reality."
    ];

    refreshAtmoBtn.addEventListener('click', function () {
        playSound('beep');
        refreshFeedbackText.style.display = 'block';

        const index = Math.min(refreshCount, REFRESH_RESPONSES.length - 1);
        refreshFeedbackText.textContent = REFRESH_RESPONSES[index];
        refreshCount++;

        // Jiggle contradiction cards
        document.querySelectorAll('.contradict-card').forEach((card) => {
            card.style.transform = `rotate(${(Math.random() - 0.5) * 6}deg) scale(1.02)`;
            setTimeout(() => {
                card.style.transform = 'none';
            }, 400);
        });

        if (refreshCount === 1) {
            showToast('ATMOSPHERE SHIFT', 'Weather changed because you refreshed.', true, '🔄');
        } else if (refreshCount === 2) {
            showToast('ATMOSPHERE CEASE & DESIST', 'Please stop manipulating the atmosphere.', true, '🛑');
        }
    });

    // -------------------------------------------------------------------------
    // ADVANCED METEOROLOGICAL TOOLS
    // Requirement:
    // 1. ☁️ Cloud Opinion -> "This cloud seems emotionally unavailable." -> Button: ASK CLOUD -> "The cloud declined to comment."
    // 2. 🌡️ Temperature Vibes -> "The temperature is approximately the temperature." -> Button: CALIBRATE -> "Calibration complete. Your screen is now 3% warmer."
    // 3. 🌬️ Wind Direction -> "Wind is coming from somewhere." -> Button: LOCATE WIND -> "Wind successfully located." -> Location: Outside
    // 4. 🌧️ Rain Detector -> Button: IS IT RAINING? -> Always responds differently:
    //    - “Probably.”
    //    - “Ask again later.”
    //    - “Rain is a social construct.”
    //    - “The rain has requested privacy.”
    //    - “We detected 14 raindrops. Unfortunately, they were from last Tuesday.”
    //    - “No rain detected. Please check your shoes.”
    // -------------------------------------------------------------------------

    // 1. Cloud Opinion
    const CLOUD_RESPONSES = [
        "The cloud declined to comment.",
        "The cloud left you on read.",
        "The cloud sighed heavily and drifted 4 feet to the left.",
        "The cloud is currently in a meeting with another cloud about synergy.",
        "The cloud rolled its eyes into an overcast front.",
        "The cloud politely asked you to respect its boundaries."
    ];

    askCloudBtn.addEventListener('click', function () {
        playSound('wind');
        const pick = CLOUD_RESPONSES[cloudAskCount % CLOUD_RESPONSES.length];
        cloudOpinionText.textContent = `“${pick}”`;
        cloudAskCount++;
        cloudResponseLog.textContent = `Cloud consultation attempt #${cloudAskCount} logged.`;
    });

    // 2. Temperature Vibes
    calibrateTempBtn.addEventListener('click', function () {
        playSound('beep');
        isCalibratedWarmer = !isCalibratedWarmer;
        if (isCalibratedWarmer) {
            document.body.classList.add('screen-warmer');
            tempVibesText.textContent = "“Calibration complete. Your screen is now 3% warmer.”";
            tempCalibrateLog.textContent = "Screen thermal rating: +3% Warm Toastiness";
        } else {
            document.body.classList.remove('screen-warmer');
            tempVibesText.textContent = "“Calibration reverted. Screen cooled back to lukewarm existentialism.”";
            tempCalibrateLog.textContent = "Screen warmth: Room temperature";
        }
    });

    // 3. Wind Direction
    locateWindBtn.addEventListener('click', function () {
        playSound('wind');
        // Spin the compass wildly
        const randomAngle = Math.floor(Math.random() * 1080 + 360);
        compassNeedle.style.transform = `rotate(${randomAngle}deg)`;

        windLocateText.innerHTML = "<strong>Wind successfully located.</strong><br>Location: <em>Outside</em>";
        windResultLog.textContent = "Coordinates: Somewhere between your window and the stratosphere.";
    });

    // 4. Rain Detector
    const RAIN_RESPONSES = [
        "Probably.",
        "Ask again later.",
        "Rain is a social construct.",
        "The rain has requested privacy.",
        "We detected 14 raindrops. Unfortunately, they were from last Tuesday.",
        "No rain detected. Please check your shoes."
    ];

    isItRainingBtn.addEventListener('click', function () {
        playSound('rain');
        const pick = RAIN_RESPONSES[rainQueryCount % RAIN_RESPONSES.length];
        rainDetectorText.textContent = `“${pick}”`;
        rainQueryCount++;
        rainResponseLog.textContent = `Rain inquiries submitted: ${rainQueryCount} (Rain remains indifferent)`;
    });

    // -------------------------------------------------------------------------
    // AI WEATHER INSIGHT BOX
    // -------------------------------------------------------------------------
    const AI_INSIGHTS = [
        "“The weather appears to be influenced by atmospheric conditions.”",
        "“If it is dark outside, our model predicts it is either nighttime or a very large bird.”",
        "“Temperature is inversely correlated with the amount of layers you wish you were wearing.”",
        "“Historical data suggests rain falls predominantly in a downwards vector.”",
        "“The wind is simply air that has somewhere else it needs to be urgently.”",
        "“Clouds are like sky cotton candy, except they taste like sorrow and dust.”"
    ];

    reGenAiInsight.addEventListener('click', function () {
        playSound('beep');
        const pick = AI_INSIGHTS[Math.floor(Math.random() * AI_INSIGHTS.length)];
        aiInsightQuote.textContent = pick;
    });

    // -------------------------------------------------------------------------
    // USELESS INTERACTIVE CANVAS MAP
    // Requirement:
    // User selected location: "YOU ARE SOMEWHERE AROUND HERE"
    // Nearby points:
    // - “Probably a road”
    // - “Suspicious cloud”
    // - “Weather occurring”
    // - “That one tree”
    // - “Unverified atmosphere”
    // - “Area where something happened once”
    // Sometimes zoom into ocean even when user selects land!
    // Map accuracy: 61% / Tooltip: “We have chosen not to elaborate.”
    // -------------------------------------------------------------------------
    const ctx = weatherMapCanvas.getContext('2d');
    let mapZoom = 1;
    let mapOffsetX = 0;
    let mapOffsetY = 0;
    let inOceanMode = false;

    function drawMap() {
        const w = weatherMapCanvas.width;
        const h = weatherMapCanvas.height;

        // Clear
        ctx.fillStyle = inOceanMode ? '#022c5e' : '#082f49';
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.translate(w / 2 + mapOffsetX, h / 2 + mapOffsetY);
        ctx.scale(mapZoom, mapZoom);
        ctx.translate(-w / 2, -h / 2);

        // Draw grid
        ctx.strokeStyle = inOceanMode ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = -200; x < w + 200; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, -200);
            ctx.lineTo(x, h + 200);
            ctx.stroke();
        }
        for (let y = -200; y < h + 200; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(-200, y);
            ctx.lineTo(w + 200, y);
            ctx.stroke();
        }

        if (inOceanMode) {
            // Draw ocean waves and deep water abyss
            ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
            for (let i = 0; i < 8; i++) {
                ctx.beginPath();
                ctx.arc(200 + i * 90, 200 + (i % 2) * 50, 80, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 20px monospace';
            ctx.fillText('🌊 PACIFIC OCEAN ABYSS (DEPTH: 5,400m)', w / 2 - 200, h / 2);
            ctx.font = '14px monospace';
            ctx.fillText('Nearest Landmass: None within your lifetime', w / 2 - 170, h / 2 + 25);
        } else {
            // Draw fake continental landmass blobs
            ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
            ctx.beginPath();
            ctx.ellipse(300, 200, 180, 110, 0.4, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.ellipse(650, 240, 200, 130, -0.2, 0, Math.PI * 2);
            ctx.fill();

            // Fake contour topography lines
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(300, 200, 120, 70, 0.4, 0, Math.PI * 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.ellipse(650, 240, 140, 80, -0.2, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    drawMap();

    // POI Pins interaction
    document.querySelectorAll('.pin-poi').forEach((poi) => {
        poi.addEventListener('click', function () {
            playSound('beep');
            const title = this.getAttribute('data-title');
            const desc = this.getAttribute('data-desc');
            poiBannerTitle.textContent = title;
            poiBannerDesc.textContent = desc;
            mapPoiBanner.style.display = 'flex';
        });
    });

    closePoiBanner.addEventListener('click', () => {
        mapPoiBanner.style.display = 'none';
    });

    // User pin click
    pinUser.addEventListener('click', () => {
        playSound('beep');
        poiBannerTitle.textContent = "YOU ARE SOMEWHERE AROUND HERE";
        poiBannerDesc.textContent = "We narrowed your position down to the Western or Eastern hemisphere.";
        mapPoiBanner.style.display = 'flex';
    });

    // Re-Center Button (Sometimes zooms into the ocean!)
    mapCenterBtn.addEventListener('click', function () {
        playSound('wind');
        // 50% chance to teleport directly into the ocean even if not clicked ocean btn
        if (Math.random() > 0.5) {
            teleportToOcean();
        } else {
            inOceanMode = false;
            mapZoom = 1;
            mapOffsetX = 0;
            mapOffsetY = 0;
            drawMap();
            mapCoords.textContent = "LAT: 42.0000° N • LON: 69.4200° W • VIBE: Land-ish";
            showToast('MAP CENTERED', 'Centered on: General continent area.', false, '🗺️');
        }
    });

    function teleportToOcean() {
        playSound('rain');
        inOceanMode = true;
        mapZoom = 1.8;
        mapOffsetX = 50;
        mapOffsetY = -40;
        drawMap();
        mapCoords.textContent = "LAT: -0.0001° S • LON: -150.2910° W • VIBE: 100% Water";
        poiBannerTitle.textContent = "PACIFIC OCEAN TELEPORT COMPLETE";
        poiBannerDesc.textContent = "The map zoomed into the middle of the ocean for no apparent reason. Bring floaties.";
        mapPoiBanner.style.display = 'flex';
        showToast('SATELLITE GLITCH', 'Map auto-repositioned to middle of Pacific Ocean.', true, '🌊');
    }

    mapOceanBtn.addEventListener('click', teleportToOcean);

    mapZoomInBtn.addEventListener('click', () => {
        mapZoom = Math.min(mapZoom + 0.3, 3);
        drawMap();
    });

    mapZoomOutBtn.addEventListener('click', () => {
        mapZoom = Math.max(mapZoom - 0.3, 0.6);
        drawMap();
    });

    // -------------------------------------------------------------------------
    // 7-DAY FORECAST "SHOW MORE ACCURATE FORECAST" -> "No."
    // -------------------------------------------------------------------------
    moreAccurateBtn.addEventListener('click', () => {
        playSound('error');
        accuracyModalBackdrop.style.display = 'flex';
    });

    closeAccuracyModal.addEventListener('click', () => {
        accuracyModalBackdrop.style.display = 'none';
    });

    // -------------------------------------------------------------------------
    // SKY CONSULTATION MODAL ("ASK THE SKY")
    // -------------------------------------------------------------------------
    const SKY_VERDICTS = [
        { title: "The sky has reviewed your search history and is judging you silently.", sub: "“I have provided oxygen to humanity for billions of years, and this is what you use my bandwidth for?”" },
        { title: "The sky is busy raining on someone else's parade right now.", sub: "“Please leave a message after the thunderclap. Beep.”" },
        { title: "The sky refuses to reveal its schedule without a signed NDA.", sub: "“Sunsets are proprietary intellectual property.”" }
    ];

    askSkyBtn.addEventListener('click', () => {
        playSound('beep');
        const pick = SKY_VERDICTS[Math.floor(Math.random() * SKY_VERDICTS.length)];
        skyVerdict.textContent = pick.title;
        skyElaboration.textContent = pick.sub;
        skyModalBackdrop.style.display = 'flex';
    });

    closeSkyModal.addEventListener('click', () => {
        skyModalBackdrop.style.display = 'none';
    });

    apologizeSkyBtn.addEventListener('click', () => {
        playSound('success');
        skyModalBackdrop.style.display = 'none';
        showToast('SKY UPDATE', 'The sky accepted your apology. A slight breeze has been granted.', false, '🕊️');
    });

    bribeSkyBtn.addEventListener('click', () => {
        playSound('error');
        skyModalBackdrop.style.display = 'none';
        showToast('REJECTED', 'The sky cannot drink coffee. You have offended the troposphere.', true, '☕');
    });

    // -------------------------------------------------------------------------
    // SETTINGS MODAL & UNIT SYSTEM
    // Requirement:
    // Units: Celsius / Fahrenheit / Vibes
    // If user selects "Vibes": "Temperature: kinda warm"
    // -------------------------------------------------------------------------
    settingsBtn.addEventListener('click', () => {
        playSound('beep');
        settingsModalBackdrop.style.display = 'flex';
    });

    closeSettingsModal.addEventListener('click', () => {
        settingsModalBackdrop.style.display = 'none';
    });

    document.querySelectorAll('input[name="units"]').forEach((radio) => {
        radio.addEventListener('change', function () {
            currentUnits = this.value;
            if (currentUnits === 'vibes') {
                unitVibePreview.textContent = "Current preview: Temperature: kinda warm";
            } else if (currentUnits === 'celsius') {
                unitVibePreview.textContent = "Current preview: Temperature: 21.0°C";
            } else {
                unitVibePreview.textContent = "Current preview: Temperature: 69.8°F";
            }
            applyUnitsToStats();
        });
    });

    saveSettingsBtn.addEventListener('click', () => {
        playSound('success');
        settingsModalBackdrop.style.display = 'none';
        showToast('SETTINGS SAVED', 'All settings preserved in our imaginary database (does nothing).', false, '💾');
    });

    resetWorseDefaultsBtn.addEventListener('click', () => {
        playSound('error');
        document.body.classList.toggle('theme-worse');
        showToast('DEGRADED', 'Visual defaults downgraded to 1999 GeoCities standard.', true, '💥');
        settingsModalBackdrop.style.display = 'none';
    });

    // -------------------------------------------------------------------------
    // ERROR MESSAGES LABORATORY
    // Requirement:
    // - Error 404: Weather went outside.
    // - Error 418: The atmosphere is a teapot.
    // - Error 503: Sky temporarily unavailable. Please try again when the Earth rotates.
    // - Error 9001: Too much weather.
    // - Error 12: We forgot what location you entered.
    // - Error: This is actually going surprisingly well. Please try again.
    // -------------------------------------------------------------------------
    const ERRORS = {
        '404': {
            title: "Error 404: Weather went outside.",
            sub: "We searched the indoor cloud chamber and found only an old radiator."
        },
        '418': {
            title: "Error 418: The atmosphere is a teapot.",
            sub: "Precipitation protocols have yielded Earl Grey tea instead of cumulus moisture."
        },
        '503': {
            title: "Error 503: Sky temporarily unavailable. Please try again when the Earth rotates.",
            sub: "Planetary rotation server is under heavy load. Please hold onto the ground."
        },
        '9001': {
            title: "Error 9001: Too much weather.",
            sub: "Atmosphere buffer overflow: Exceeded maximum permissible cloud units."
        },
        '12': {
            title: "Error 12: We forgot what location you entered.",
            sub: "Short term memory exhausted by calculating humidity vibes."
        },
        'optimism': {
            title: "Error: This is actually going surprisingly well. Please try again.",
            sub: "Our QA department detected an unacceptable lack of confusion. Aborting."
        }
    };

    document.querySelectorAll('.err-btn').forEach((btn) => {
        btn.addEventListener('click', function () {
            playSound('error');
            const errKey = this.getAttribute('data-err');
            const errData = ERRORS[errKey];
            if (errData) {
                errorTitle.textContent = errData.title;
                errorSubtitle.textContent = errData.sub;
                errorBannerDisplay.style.display = 'flex';
                showToast('SYSTEM FAULT', errData.title, true, '❌');
            }
        });
    });

    dismissErrBtn.addEventListener('click', () => {
        errorBannerDisplay.style.display = 'none';
    });

    // -------------------------------------------------------------------------
    // SPONTANEOUS RANDOM LOADING SPINNER (Occurs for no reason)
    // -------------------------------------------------------------------------
    function triggerSpontaneousSync() {
        randomSyncOverlay.style.display = 'flex';
        syncProgressFill.style.width = '0%';
        playSound('beep');

        let p = 0;
        const interval = setInterval(() => {
            p += 15;
            syncProgressFill.style.width = p + '%';
            if (p >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    randomSyncOverlay.style.display = 'none';
                    showToast('CLOUD SYNC', 'Literal sky cloud synchronization completed successfully.', false, '☁️');
                }, 400);
            }
        }, 280);
    }

    cancelSyncBtn.addEventListener('click', () => {
        randomSyncOverlay.style.display = 'none';
        showToast('WARNING', 'You cancelled sync. Local humidity increased by 0.04% out of spite.', true, '⚠️');
    });

    // Trigger spontaneous sync after 50 seconds
    setTimeout(triggerSpontaneousSync, 50000);

    // -------------------------------------------------------------------------
    // SOUND AND THEME TOGGLES
    // -------------------------------------------------------------------------
    soundToggleBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        if (soundEnabled) {
            soundIcon.textContent = '🔊';
            soundLabel.textContent = 'Sound: Annoying';
            playSound('beep');
        } else {
            soundIcon.textContent = '🔇';
            soundLabel.textContent = 'Sound: Muted';
        }
    });

    themeWorseBtn.addEventListener('click', () => {
        playSound('beep');
        document.body.classList.toggle('theme-worse');
        showToast('AESTHETIC UPGRADE?', 'Color balance intentionally compromised.', false, '🎨');
    });

    streakBadge.addEventListener('click', () => {
        playSound('success');
        streakCoins += 15;
        streakBadge.textContent = `🔥 STREAK: ${streakCoins} CLOUD COINS`;
        showToast('BONUS COINS', `Claimed 15 Cloud Coins! Redeemable for 0 liters of fresh air.`, false, '🪙');
    });

    // Close modals on clicking backdrop
    [skyModalBackdrop, accuracyModalBackdrop, settingsModalBackdrop].forEach((backdrop) => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                backdrop.style.display = 'none';
            }
        });
    });

    // Dodge cursor micro-animation on certain buttons occasionally
    document.querySelectorAll('.btn-micro, .err-btn').forEach((btn) => {
        btn.addEventListener('mouseenter', function () {
            if (Math.random() < 0.2) {
                const x = (Math.random() - 0.5) * 20;
                const y = (Math.random() - 0.5) * 14;
                this.style.transform = `translate(${x}px, ${y}px)`;
                setTimeout(() => {
                    this.style.transform = 'none';
                }, 500);
            }
        });
    });

})();
