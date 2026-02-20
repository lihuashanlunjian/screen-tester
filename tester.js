const testModes = [
    { type: 'solid', color: '#000000', name: 'Black' },
    { type: 'solid', color: '#FFFFFF', name: 'White' },
    { type: 'solid', color: '#FF0000', name: 'Red' },
    { type: 'solid', color: '#00FF00', name: 'Green' },
    { type: 'solid', color: '#0000FF', name: 'Blue' },
    { type: 'gradient', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', name: 'Gradient Purple' },
    { type: 'gradient', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', name: 'Gradient Pink' },
    { type: 'gradient', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', name: 'Gradient Blue' },
    { type: 'text', color: '#000000', text: 'A', name: 'Clarity Test' }
];

let currentIndex = 0;
let isTesting = false;
let autoInterval = null;
let isAutoMode = false;
const guidePage = document.getElementById('guide-page');
const testPage = document.getElementById('test-page');
const testContainer = document.getElementById('test-container');
const startBtn = document.getElementById('start-btn');
const autoBtn = document.getElementById('auto-btn');
let autoPrompt = null;

function renderTest() {
    const mode = testModes[currentIndex];
    testContainer.innerHTML = '';
    testContainer.style.background = mode.color;
    
    if (mode.type === 'text') {
        const textEl = document.createElement('div');
        textEl.className = 'text-test';
        textEl.style.color = '#FFFFFF';
        textEl.textContent = mode.text;
        testContainer.appendChild(textEl);
    }
}

function startTesting(auto = false) {
    isTesting = true;
    isAutoMode = auto;
    currentIndex = 0;
    guidePage.classList.add('hidden');
    testPage.classList.remove('hidden');
    
    enterFullscreen().then(() => {
        renderTest();
        if (auto) {
            startAutoPlay();
        }
    }).catch(() => {
        showFullscreenPrompt(auto);
    });
}

function showFullscreenPrompt(isAuto) {
    if (autoPrompt) {
        autoPrompt.remove();
    }
    autoPrompt = document.createElement('div');
    autoPrompt.style.position = 'fixed';
    autoPrompt.style.top = '0';
    autoPrompt.style.left = '0';
    autoPrompt.style.width = '100%';
    autoPrompt.style.height = '100%';
    autoPrompt.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
    autoPrompt.style.zIndex = '1000';
    autoPrompt.style.cursor = 'pointer';
    autoPrompt.style.display = 'flex';
    autoPrompt.style.justifyContent = 'center';
    autoPrompt.style.alignItems = 'center';
    
    const titleText = isAuto ? 'Click to start auto play' : 'Click to start test';
    const hintText = 'Click anywhere to enter fullscreen and start auto test';
    
    autoPrompt.innerHTML = `
        <div style="background: rgba(0, 0, 0, 0.9); padding: 40px 60px; border-radius: 12px; text-align: center; pointer-events: none;">
            <h2 style="font-size: 24px; margin-bottom: 16px; font-weight: 500;">${titleText}</h2>
            <p style="font-size: 14px; color: #aaa;">${hintText}</p>
        </div>
    `;
    testPage.appendChild(autoPrompt);
    
    autoPrompt.addEventListener('click', () => {
        autoPrompt.remove();
        autoPrompt = null;
        enterFullscreen();
        renderTest();
        if (isAuto) {
            startAutoPlay();
        }
    });
}

function startAutoPlay() {
    if (autoInterval) {
        clearInterval(autoInterval);
    }
    autoInterval = setInterval(nextTest, 3000);
}

function stopTesting() {
    isTesting = false;
    if (autoInterval) {
        clearInterval(autoInterval);
        autoInterval = null;
    }
    if (autoPrompt) {
        autoPrompt.remove();
        autoPrompt = null;
    }
    onTestFinished();
}

function onTestFinished() {
    if (document.exitFullscreen) document.exitFullscreen();
    const surveyModal = document.getElementById('surveyModal');
    surveyModal.classList.remove('modal-hidden');
    surveyModal.classList.add('modal-visible');
}

function startGeneratingReport() {
    const hasDeadPixel = document.getElementById('chk-deadpixel').checked;
    const bleedingSeverity = document.getElementById('sel-bleeding').value;

    const surveyModal = document.getElementById('surveyModal');
    surveyModal.classList.remove('modal-visible');
    surveyModal.classList.add('modal-hidden');

    const reportModal = document.getElementById('reportModal');
    reportModal.classList.remove('modal-hidden');
    reportModal.classList.add('modal-visible');
    
    const contentDiv = document.getElementById('reportContent');
    const scoreDiv = document.getElementById('reportScore');
    
    contentDiv.innerHTML = "📡 Connect to cloud analytics engine...<br>";
    
    setTimeout(() => {
        contentDiv.innerHTML += "📊 Comparing with the ISO-13406-2 standard database...<br>";
    }, 800);

    setTimeout(() => {
        contentDiv.innerHTML += "🧮 Calculate panel uniformity score...<br>";
    }, 1600);

    setTimeout(() => {
        const result = generatePseudoAIReport({
            hasDeadPixel: hasDeadPixel,
            bleedingSeverity: bleedingSeverity
        });

        let scoreColor = result.score >= 90 ? '#4CAF50' : (result.score >= 70 ? '#FF9800' : '#F44336');
        scoreDiv.innerHTML = `<span style="color:${scoreColor}">${result.score}</span><span style="font-size:20px; color:#999;"> / 100</span>`;
        
        let htmlContent = result.markdown
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            .replace(/\n/g, '<br>');
            
        contentDiv.innerHTML = htmlContent;

        contentDiv.innerHTML += `<div style="margin-top:30px; padding:15px; background:#f9f9f9; border-left:4px solid #FFDD00; font-size:14px; text-align:left;"><b>💡 Expert Tip:</b>${result.score < 80 ? 'This screen quality is average. If you are considering a return, check out our <a href="buying-guide.html" target="_blank">monitor buying guide</a>.' : 'Want to keep your screen clean? Check out our <a href="clean-guide.html" target="_blank">ultimate screen cleaning guide</a>.'}</div>`;

    }, 2500);
}

function nextTest() {
    currentIndex = (currentIndex + 1) % testModes.length;
    renderTest();
}

function enterFullscreen() {
    return new Promise((resolve, reject) => {
        const elem = document.documentElement;
        try {
            if (elem.requestFullscreen) {
                elem.requestFullscreen().then(resolve).catch(reject);
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
                setTimeout(resolve, 100);
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
                setTimeout(resolve, 100);
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
                setTimeout(resolve, 100);
            } else {
                resolve();
            }
        } catch (e) {
            reject(e);
        }
    });
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startTesting(false);
});
autoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startTesting(true);
});

document.addEventListener('click', (e) => {
    if (isTesting) {
        nextTest();
    } else if (e.target !== startBtn && e.target !== autoBtn && !startBtn.contains(e.target) && !autoBtn.contains(e.target)) {
        startTesting(false);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isTesting) {
        stopTesting();
    }
});

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && isTesting) {
        stopTesting();
    }
});

document.addEventListener('webkitfullscreenchange', () => {
    if (!document.webkitFullscreenElement && isTesting) {
        stopTesting();
    }
});

document.addEventListener('mozfullscreenchange', () => {
    if (!document.mozFullScreenElement && isTesting) {
        stopTesting();
    }
});

document.addEventListener('MSFullscreenChange', () => {
    if (!document.msFullscreenElement && isTesting) {
        stopTesting();
    }
});

function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode === 'auto') {
        startTesting(true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkUrlParams();

    const generateReportBtn = document.getElementById('generateReportBtn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', startGeneratingReport);
    }

    const reloadBtn = document.getElementById('reloadBtn');
    if (reloadBtn) {
        reloadBtn.addEventListener('click', () => {
            location.reload();
        });
    }
});
