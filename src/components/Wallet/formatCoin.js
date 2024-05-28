const formatCoin = (coin) => {
    const coinStr = String(coin);

    let formattedCoin = coinStr;
    if (coinStr.includes('.') && Number(coinStr.split('.')[1]) === 0) {
        formattedCoin = coinStr.split('.')[0];
    } else {
        const parts = coinStr.split('.');
        const integerPart = parts[0];

        const partBillion = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (partBillion.length > 11) {
            const billions = parseFloat(coin) / 1000000000;
            formattedCoin = billions.toFixed(2) + ' tỷ';
        } else {
            formattedCoin = partBillion;
        }
    }

    return formattedCoin;
};

export default formatCoin;
