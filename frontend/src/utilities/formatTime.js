// This function takes a duration string in the format "HH:MM" and returns an AM/PM string
// such as "1:00" to "1 am" or "13:00" to "1 pm"
export const formatTimeToAmPm = (time) => {
    const [hour, minute] = time.split(':').map(Number);
    const amPm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for midnight
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${amPm}`;
};
