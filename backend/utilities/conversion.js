const convertToSeconds = (time) => {
    const parts = time.split(':').map(Number);
    let seconds = 0;
    let multiplier = 1;

    // Process from right (least significant: seconds) to left.
    for (let i = parts.length - 1; i >= 0; i--) {
        seconds += parts[i] * multiplier;
        multiplier *= 60;
    }

    return seconds;
};

const parseDurationToSeconds = (duration) => {
    if (typeof duration === 'number') return duration; // Already a number

    const lower = duration.trim().toLowerCase();

    // If duration contains a colon, assume it's already in hh:mm:ss (or mm:ss) format.
    if (lower.includes(':')) {
        return convertToSeconds(lower);
    }

    // Otherwise, check for keywords.
    if (lower.includes('hour')) {
        const num = parseFloat(lower);
        return num * 3600;
    }
    if (lower.includes('minute')) {
        const num = parseFloat(lower);
        return num * 60;
    }
    if (lower.includes('second')) {
        return parseFloat(lower);
    }

    // Fallback: try to parse it as seconds.
    return parseFloat(lower);
};

module.exports = { convertToSeconds, parseDurationToSeconds };
