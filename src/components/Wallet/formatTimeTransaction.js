const formatTimeTransaction = (dayTime) => {
    const date = new Date(dayTime);
    date.setHours(date.getHours());

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} - ${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

    return formattedTime;
};

export default formatTimeTransaction;
