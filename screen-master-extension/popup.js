document.addEventListener('DOMContentLoaded', () => {
    const manualBtn = document.getElementById('manual-test');
    const autoBtn = document.getElementById('auto-test');
    const bmcBtn = document.querySelector('.bmc-button');

    manualBtn.addEventListener('click', () => {
        openTestPage(false);
    });

    autoBtn.addEventListener('click', () => {
        openTestPage(true);
    });

    if (bmcBtn) {
        bmcBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.href;
            chrome.tabs.create({ url: url });
        });
    }

    function openTestPage(auto) {
        const url = auto ? '../tester.html?mode=auto' : '../tester.html';
        chrome.tabs.create({
            url: chrome.runtime.getURL(url)
        });
        window.close();
    }
});
