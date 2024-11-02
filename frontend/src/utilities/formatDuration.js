// This function takes a duration string in the format "HH:MM" and returns a human-readable string
// such as "1:30:00" to "1 hour and 30 minutes".
export const formatDuration = (duration) => {
    const [hours, minutes] = duration.split(":").map(Number);

    let message = "";
    if (hours > 0) message += `${hours} hour${hours > 1 ? 's' : ''}`;
    if (hours > 0 && minutes > 0) message += " and ";
    if (minutes > 0) message += `${minutes} minute${minutes > 1 ? 's' : ''}`;

    return message;
};
