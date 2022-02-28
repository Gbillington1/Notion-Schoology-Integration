function getISODatetime(date) {
    let datetime;
    if (date) {
        datetime = new Date(date);
    } else {
        datetime = new Date();
    }
    
    const adjustedDatetime = new Date(datetime.getTime() - (datetime.getTimezoneOffset() * 60000));
    return adjustedDatetime.toISOString();
} 

function getISODate(date) {
    const ISODate = getISODatetime(date).split('T')[0];
    return ISODate;
}

function addDaysToDate(date, daysToAdd) {
    const currentDatetime = new Date(date);
    const newDatetime = new Date(currentDatetime.setDate(currentDatetime.getDate() + daysToAdd));
    const newDate = newDatetime.toISOString().split('T')[0];
    return newDate;
}

module.exports = {
    getISODatetime,
    getISODate,
    addDaysToDate
}