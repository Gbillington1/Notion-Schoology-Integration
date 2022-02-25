class Event {

    /**
     * Create an event to be displayed in Notion
     * @param {string} name - The name of the event
     * @param {string} database - The name of the database as shown in Notion
     * @param {string} date - The date of the event in timezone adjusted ISO format (e.g. 2022-02-24)
     * @param {string} priority - The priority of the event as shown in Notion
     * @param {number} projectPageID - The ID of the project page in the Projects DB. Used to link page to row in master
     * @param {string} status - The status of the event as shown in Notion
     */
    constructor(eventID, name, database, date, priority = "Medium", projectPageID = null, status = "To Do") {
        this.eventID = eventID;
        this.name = name;
        this.database = database;
        this.date = date;
        this.priority = priority;
        this.projectPageID = projectPageID;
        this.status = status;
    }
}

module.exports = {
    Event
}