
const formatTime7Reservation = (dayTime) => {
    const date = new Date(dayTime);
    date.setHours(date.getHours());
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

export default formatTime7Reservation