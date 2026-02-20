/**
 * Pseudo AI Report Generator
 * @param {Object} inputData - User's test results
 * Structure example: { hasDeadPixel: boolean, bleedingSeverity: 'none'|'low'|'high', screenType: 'LCD' }
 */
function generatePseudoAIReport(inputData) {
    // 1. Corpus: Professional terminology pool (random selection)
    const corpus = {
        // Opening
        intro: [
            "Based on physical property analysis of the current display terminal and ISO-13406-2 pixel defect standards, the following inspection report is generated.",
            "The system has completed comprehensive scanning of panel color uniformity, pixel response, and backlight bleeding. Analysis results are as follows.",
            "AI vision engine has processed your screen test data. Below is a professional assessment based on hardware performance."
        ],
        // Dead pixel analysis (if dead pixels)
        deadPixelBad: [
            "Active Matrix Anomaly detected on the panel. This typically manifests as sub-pixel transistor failure (Stuck/Dead Pixel).",
            "Visible pixel defects found. According to industry standards, this is caused by dust or laser cutting errors during TFT manufacturing.",
            "The screen has non-luminous or permanently lit pixels. It is recommended to double-check on bright and pure black backgrounds."
        ],
        // Dead pixel analysis (if no dead pixels)
        deadPixelGood: [
            "No dead or stuck pixels found during RGB full gamut scanning. Pixel array integrity is extremely high.",
            "Pixel test passed. This panel's transistor yield performance is excellent, meeting A+ grade panel standards.",
            "Pixel response is normal in full-screen solid color tests, with no visible dead pixels or hot pixels."
        ],
        // Bleeding analysis (slight)
        bleedingLow: [
            "Slight light leakage at the edges. This is usually determined as IPS Glow, a physical property of liquid crystal molecule alignment, not a quality defect.",
            "Slight unevenness visible on black background. This is a common phenomenon in edge-lit monitors and does not affect daily use in bright environments.",
            "Faint backlight unevenness detected, but within Delta E color accuracy tolerance range."
        ],
        // Bleeding analysis (severe)
        bleedingHigh: [
            "Significant backlight bleeding phenomenon in the backlight module. Light flux significantly leaks at the bezel.",
            "Poor black uniformity with visible clouding. This may affect immersion when watching dark movies or playing games.",
            "Panel encapsulation process may have tolerance issues, causing severe backlight bleeding due to bezel pressure on the liquid crystal layer."
        ],
        // Summary advice (perfect)
        advicePerfect: [
            "Congratulations! This is an excellent \"perfect screen\". We recommend keeping it and enjoying it.",
            "Overall score is extremely high. No post-purchase processing needed. Recommend adjusting brightness to 60-80% to extend backlight life.",
            "This screen passed all key indicator tests with excellent quality, a \"golden sample\"."
        ],
        // Summary advice (normal)
        adviceNormal: [
            "Overall performance meets mainstream factory standards. Slight imperfections are barely noticeable at normal viewing distance. Recommend normal use.",
            "Although there are minor flaws, it's a \"qualified product\" at this price range. Unless you're an extreme perfectionist, no need for exchanges.",
            "Recommend avoiding long-term static images in daily use to prevent image retention that isn't actually happening."
        ],
        // Summary advice (bad)
        adviceBad: [
            "Given the noticeable defects severely impacting visual experience, we recommend contacting the seller for after-sales service or return/exchange.",
            "This panel's quality control performance is below industry average. Recommend saving a screenshot of this report as evidence for return/exchange.",
            "For your long-term usage experience, we recommend trying to exchange for a device with better panel quality."
        ]
    };

    // 2. Helper function: random selection
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    // 3. Logic judgment and assembly
    let reportContent = [];
    let score = 100;
    let defectCount = 0;

    // Add report header
    const reportId = "RPT-" + Math.floor(Math.random() * 1000000);
    const dateStr = new Date().toLocaleDateString();
    
    // --- Logic processing ---
    
    // Opening
    reportContent.push(`**Report ID:** ${reportId}`);
    reportContent.push(`**Date:** ${dateStr}`);
    reportContent.push(`---`);
    reportContent.push(`**Introduction:** ${pick(corpus.intro)}`);

    // Dead pixel judgment
    if (inputData.hasDeadPixel) {
        score -= 20;
        defectCount++;
        reportContent.push(`\n**❌ Pixel Defect Analysis:**`);
        reportContent.push(pick(corpus.deadPixelBad));
    } else {
        reportContent.push(`\n**✅ Pixel Defect Analysis:**`);
        reportContent.push(pick(corpus.deadPixelGood));
    }

    // Bleeding judgment
    reportContent.push(`\n**💡 Backlight Uniformity Analysis:**`);
    if (inputData.bleedingSeverity === 'high') {
        score -= 30;
        defectCount++;
        reportContent.push(pick(corpus.bleedingHigh));
    } else if (inputData.bleedingSeverity === 'low') {
        score -= 5;
        reportContent.push(pick(corpus.bleedingLow));
    } else {
        reportContent.push("Backlight control is excellent, no obvious bleeding or glow. Black purity is high.");
    }

    // Generate conclusion
    reportContent.push(`\n**📝 Comprehensive Assessment & Recommendations:**`);
    if (score >= 95) {
        reportContent.push(pick(corpus.advicePerfect));
    } else if (score >= 70) {
        reportContent.push(pick(corpus.adviceNormal));
    } else {
        reportContent.push(pick(corpus.adviceBad));
    }

    // 4. Return object
    return {
        score: score,
        markdown: reportContent.join("\n"),
        isPerfect: score === 100
    };
}
