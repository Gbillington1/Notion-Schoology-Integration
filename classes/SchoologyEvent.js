class SchoologyEvent {
    constructor(sgyEvent) {
        this.eventID = sgyEvent.id,
        this.courseSectionID = sgyEvent.section_id,
        this.title = sgyEvent.title,
        this.date = sgyEvent.start.split(" ")[0],
        this.time = sgyEvent.start.split(" ")[1],
        this.type = sgyEvent.type,
        this.url = sgyEvent.web_url
    }
}

module.exports = {
    SchoologyEvent
}