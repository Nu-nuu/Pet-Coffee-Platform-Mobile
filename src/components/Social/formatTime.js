
const formatTime = (dayTime) => {

    const postDate = new Date(dayTime);
    const now = new Date();
    const diffTime = now.getTime() - postDate.getTime();

    const seconds = Math.floor(diffTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return days === 1 ? '1 ngày trước' : `${days} ngày trước`;
    } else if (hours > 0) {
        return hours === 1 ? '1 giờ trước' : `${hours} giờ trước`;
    } else {
        return minutes <= 1 ? '1 phút trước' : `${minutes} phút trước`;
    }
};


export default formatTime;
