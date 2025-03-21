export const convertToTimeWords = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];

    if (hours) {
        parts.push(hours + (hours === 1 ? " hour" : " hours"));
    }
    if (minutes) {
        parts.push(minutes + (minutes === 1 ? " minute" : " minutes"));
    }
    if (seconds || parts.length === 0) {
        parts.push(seconds + (seconds === 1 ? " second" : " seconds"));
    }

    // Join all but the last part with a comma and add "and" before the final part.
    if (parts.length > 1) {
        return parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1];
    }
    return parts[0];
};
