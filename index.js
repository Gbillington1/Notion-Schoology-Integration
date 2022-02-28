if (process.env.NODE_ENV === "production") {
    require('dotenv').config({ path: '/home/graham/notion-schoology-integration/.env' });
} else {
    require('dotenv').config({ path: './.env' });
}

const schoology = require('./schoology.js');
const notion = require('./notion.js');
const { Event } = require('./Event.js');

// TODO: Add error handling
// TODO: Less loops, faster code
(async () => {

    // get events from schoology (7 day range default)
    let sgyEvents = await schoology.getUserEvents(process.env.SCHOOLOGY_USER_ID, process.env.START_DATE);

    // get page objects with the tag "Course"
    const notionProjects = await notion.getCourseProjects();

    // filter out events that aren't assignments
    sgyEvents = sgyEvents.filter((event) => {
        return event.type === "assignment"
    })

    // create all pending notion entries
    let entriesFromSchoology = [];

    // create Notion objects from each schoology event
    for (let i = 0; i < sgyEvents.length; i++) {

        const sgyCourse = await schoology.getCourseSection(sgyEvents[i].section_id);
        const sgyCourseTitle = sgyCourse.course_title.replace(/\s+/g, '-');
        // find page in notion that matches the schoology event course
        const projectPage = notionProjects.find(project => project.url.includes(sgyCourseTitle));

        // create a new event object
        // TODO: determine which events are deadlines and which are tasks
        let notionEvent = new Event(
            sgyEvents[i].id,
            sgyEvents[i].title,
            "Tasks",
            sgyEvents[i].start.split(" ")[0],
            "Medium",
            projectPage.id,
            "To Do"
        );

        entriesFromSchoology.push(notionEvent);

    }

    // TODO: refactor/clean up this implementation?
    notion.handleCreation(entriesFromSchoology);

})()