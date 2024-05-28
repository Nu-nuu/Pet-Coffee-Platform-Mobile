import { format } from "date-fns";

const formatDayReservation = (dayTime) => {

    if (!dayTime) {
        return 'Đang cập nhật';
    }

    const date = new Date(dayTime);
    const dayOfWeek = format(date, 'EEEE');
    let customDayOfWeek = '';

    switch (dayOfWeek) {
        case 'Sunday':
            customDayOfWeek = 'Chủ nhật';
            break;
        case 'Monday':
            customDayOfWeek = 'Thứ 2';
            break;
        case 'Tuesday':
            customDayOfWeek = 'Thứ 3';
            break;
        case 'Wednesday':
            customDayOfWeek = 'Thứ 4';
            break;
        case 'Thursday':
            customDayOfWeek = 'Thứ 5';
            break;
        case 'Friday':
            customDayOfWeek = 'Thứ 6';
            break;
        case 'Saturday':
            customDayOfWeek = 'Thứ 7';
            break;
        default:
            break;
    }

    const formattedDate = format(date, `'${customDayOfWeek}', dd 'Tháng' MM, yyyy`);
    return formattedDate;
};

export default formatDayReservation;
