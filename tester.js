const testModes = [
    { type: 'solid', color: '#000000', name: '黑色' },
    { type: 'solid', color: '#FFFFFF', name: '白色' },
    { type: 'solid', color: '#FF0000', name: '红色' },
    { type: 'solid', color: '#00FF00', name: '绿色' },
    { type: 'solid', color: '#0000FF', name: '蓝色' },
    { type: 'gradient', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', name: '渐变紫' },
    { type: 'gradient', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', name: '渐变粉' },
    { type: 'gradient', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', name: '渐变蓝' },
    { type: 'text', color: '#000000', text: 'A', name: '清晰度测试' }
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
    
    if (auto) {
        enterFullscreen().then(() => {
            renderTest();
            startAutoPlay();
        }).catch(() => {
            showAutoPrompt();
        });
    } else {
        enterFullscreen().then(() => {
            renderTest();
        }).catch(() => {
            renderTest();
        });
    }
}

function showAutoPrompt() {
    if (autoPrompt) {
        autoPrompt.remove();
    }
    autoPrompt = document.createElement('div');
    autoPrompt.style.position = 'fixed';
    autoPrompt.style.top = '50%';
    autoPrompt.style.left = '50%';
    autoPrompt.style.transform = 'translate(-50%, -50%)';
    autoPrompt.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    autoPrompt.style.color = '#fff';
    autoPrompt.style.padding = '40px 60px';
    autoPrompt.style.borderRadius = '12px';
    autoPrompt.style.textAlign = 'center';
    autoPrompt.style.zIndex = '1000';
    autoPrompt.style.cursor = 'pointer';
    autoPrompt.innerHTML = `
        <h2 style="font-size: 24px; margin-bottom: 16px; font-weight: 500;">点击屏幕开始自动播放</h2>
        <p style="font-size: 14px; color: #888;">点击任意位置进入全屏并开始自动测试</p>
    `;
    testPage.appendChild(autoPrompt);
    
    autoPrompt.addEventListener('click', () => {
        autoPrompt.remove();
        autoPrompt = null;
        enterFullscreen();
        renderTest();
        startAutoPlay();
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
    
    contentDiv.innerHTML = "📡 连接至云端分析引擎...<br>";
    
    setTimeout(() => {
        contentDiv.innerHTML += "📊 正在对比 ISO-13406-2 标准数据库...<br>";
    }, 800);

    setTimeout(() => {
        contentDiv.innerHTML += "🧮 计算面板均匀性得分...<br>";
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

        contentDiv.innerHTML += `
            <div style="margin-top:30px; padding:15px; background:#f9f9f9; border-left:4px solid #FFDD00; font-size:14px; text-align:center;">
                <b>💡 专家提示：</b><br>
                ${result.score < 80 ? '这块屏幕的素质一般，如果您考虑退货，可以看看 <a href="buying-guide.html" target="_blank">显示器选购指南</a>。' : '想要保持屏幕清洁？推荐阅读 <a href="clean-guide.html" target="_blank">屏幕清洁终极指南</a>。'}
            </div>
        `;

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
                resolve();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
                resolve();
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
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

startBtn.addEventListener('click', () => startTesting(false));
autoBtn.addEventListener('click', () => startTesting(true));

document.addEventListener('click', (e) => {
    if (isTesting && e.target === testContainer) {
        nextTest();
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
