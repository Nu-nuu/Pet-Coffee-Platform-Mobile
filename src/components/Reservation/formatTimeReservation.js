
const formatTimeReservation = (dayTime) => {
    const date = new Date(dayTime);
    date.setHours(date.getHours() - 7);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

export default formatTimeReservation