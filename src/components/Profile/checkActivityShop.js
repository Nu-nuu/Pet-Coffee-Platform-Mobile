const checkActivityShop = (startTime, endTime) => {
    if (!startTime || !endTime) {
        return 'Chưa có thông tin';
    }

    const utc7Offset = 7 * 60 * 60 * 1000;

    const currentTime = new Date(Date.now() + utc7Offset);
    const startTimeParts = startTime.split(':');
    const endTimeParts = endTime.split(':');


    if (startTimeParts.length !== 2 || endTimeParts.length !== 2) {
        return 'Chưa có thông tin';
    }

    const startHour = parseInt(startTimeParts[0]);
    const startMinute = parseInt(startTimeParts[1]);

    const endHour = parseInt(endTimeParts[0]);
    const endMinute = parseInt(endTimeParts[1]);


    const startTimeObj = new Date();
    startTimeObj.setUTCHours(startHour, startMinute, 0);
    startTimeObj.setTime(startTimeObj.getTime());

    const endTimeObj = new Date();
    endTimeObj.setUTCHours(endHour, endMinute, 0);
    endTimeObj.setTime(endTimeObj.getTime());



    const isValidStart = !isNaN(startTimeObj.getTime());
    const isValidEnd = !isNaN(endTimeObj.getTime());

    if (!isValidStart || !isValidEnd) {
        return 'Thời gian không hợp lệ';
    }




    if (currentTime >= startTimeObj && currentTime <= endTimeObj) {
        return 'Đang mở cửa';
    } else {
        return 'Đang đóng cửa';
    }
};

export default checkActivityShop;
