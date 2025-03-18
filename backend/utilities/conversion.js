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

const convertToTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // When hours exist, pad minutes and seconds to 2 digits.
    if (hours) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    // When no hours, you might choose a different format.
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

module.exports = { convertToSeconds, convertToTime };
