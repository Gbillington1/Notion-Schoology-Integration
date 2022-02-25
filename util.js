function getISODate(date) {
    let datetime;
    if (date) {
        datetime = new Date(date);
    } else {
        datetime = new Date();
    }
    
    const adjustedDatetime = new Date(datetime.getTime() - (datetime.getTimezoneOffset() * 60000));
    const newDate = adjustedDatetime.toISOString().split('T')[0];
    return newDate;
}

function addDaysToDate(date, daysToAdd) {
    const currentDatetime = new Date(date);
    const newDatetime = new Date(currentDatetime.setDate(currentDatetime.getDate() + daysToAdd));
    const newDate = newDatetime.toISOString().split('T')[0];
    return newDate;
}

module.exports = {
    getISODate,
    addDaysToDate
}