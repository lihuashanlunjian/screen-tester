document.addEventListener('DOMContentLoaded', () => {
    const manualBtn = document.getElementById('manual-test');
    const autoBtn = document.getElementById('auto-test');

    manualBtn.addEventListener('click', () => {
        openTestPage(false);
    });

    autoBtn.addEventListener('click', () => {
        openTestPage(true);
    });

    function openTestPage(auto) {
        const url = auto ? '../tester.html?mode=auto' : '../tester.html';
        chrome.tabs.create({
            url: chrome.runtime.getURL(url)
        });
        window.close();
    }
});
