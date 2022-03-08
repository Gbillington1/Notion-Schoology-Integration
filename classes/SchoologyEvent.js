const schoology = require("../schoology.js");
const notion = require("../notion.js");

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

    /**
     * Uses schoology API to get the course of the event, then uses the notion projects to find the page ID of the corresponding page in the project database
     * 
     */
    async getProjectRelationID() {

        const eventCourseSection = await schoology.getCourseSection(this.courseSectionID);
        const eventCourseTitle = eventCourseSection.course_title.replace(/\s+/g, '-');

        const notionProjects = await notion.getCourseProjects();

        for (let i = 0; i < notionProjects.length; i++) {
            if (notionProjects[i].url.includes(eventCourseTitle)) {
                return notionProjects[i].id;
            }
        }
        throw new Error(`Could not find project relation ID for Schoology Event: ${this.title}`);

    }

}

module.exports = {
    SchoologyEvent
}