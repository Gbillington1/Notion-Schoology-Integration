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

function logDatetime() {
    const datetime = getISODatetime().replace(/([TZ])/g, " ").trim();
    return `[${datetime}]`;
}

function addDaysToDate(date, daysToAdd) {
    const currentDatetime = new Date(date);
    const newDatetime = new Date(currentDatetime.setDate(currentDatetime.getDate() + daysToAdd));
    const newDate = newDatetime.toISOString().split('T')[0];
    return newDate;
}

function subtractDaysFromDate(date, daysToSubtract) {
    const currentDatetime = new Date(date);
    const newDatetime = new Date(currentDatetime.setDate(currentDatetime.getDate() - daysToSubtract));
    const newDate = newDatetime.toISOString().split('T')[0];
    return newDate;
}

/**
 * Convert a Notion Database response to an array of objects
 * @param {Notion Response} resp Database data from Notion API
 * @returns {{object: string, id: string, created_time: string, icon: object, title: string, properties: object, parent: object, url: string}[]} Array of objects containing page data
 */
function fromNotionDatabaseResponse(resp) {
    const dbs = resp.results.map(db => {
        const dbObj = {
            object: db.object,
            id: db.id,
            created_time: db.created_time,
            icon: db.icon ?? null,
            title: db.title[0].plain_text,
            properties: db.properties,
            parent: db.parent,
            url: db.url,
        }
        return dbObj
    });
    return dbs;
}

/**
 * Convert a Notion Page response to an array of objects
 * @param {Notion Response} resp Page data from Notion API
 * @returns {{object: string, id: string, created_time: string, last_edited_time: string, icon: object, title: string, properties: object, parent: object, url: string}[]} Array of objects containing page data
 */
function fromNotionPageResponse(resp) {
    const pages = resp.results.map(page => {
        const notionPage = {
            object: page.object,
            id: page.id,
            created_time: page.created_time,
            last_edited_time: page.last_edited_time,
            icon: page.icon ?? null,
            title: page.properties.Name.title[0].text.content,
            properties: page.properties,
            parent: page.parent,
            url: page.url,
        }
        return notionPage;
    });
    return pages; 
}

/**
 * Convert a /events Schoology API response to an array of objects
 * @param {Axios Data} resp Data from Schoology API
 * @returns {{id: number, title: string, description: string, start: string, type: string, realm: string, section_id: number}[]} Array of objects containing event data
 */
function fromSchoologyResponse(resp) {
    const events = resp.event.map(event => {
        const sgyEventObject = {
            id: event.id,
            title: event.title,
            description: event.description,
            start: event.start,
            type: event.type,
            realm: event.realm,
            section_id: event.section_id,
        }
        return sgyEventObject;
    });
    return events;
}

module.exports = {
    getISODatetime,
    getISODate,
    logDatetime,
    addDaysToDate,
    subtractDaysFromDate
}