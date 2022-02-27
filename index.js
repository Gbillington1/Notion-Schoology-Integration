require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const schoology = require('./schoology.js');
const notion = require('./notion.js');
const util = require('./util.js');
const { Event } = require('./Event.js');

(async () => {

    // get events from schoology (7 day range)
    const sgyEvents = await schoology.getUserEvents(process.env.SCHOOLOGY_USER_ID);

    // get page objects with the tag "Course"
    const notionProjects = await notion.getCourseProjects();

    sgyEvents.forEach(async (event) => {

        if (event.type === "assignment") {

            // get title of course from from /sections/{id}
            const sgyCourse = await schoology.getCourseSection(event.section_id);
            const sgyCourseTitle = sgyCourse.course_title.replace(/\s+/g, '-');

            // find page in notion that matches the schoology event course
            const projectPage = notionProjects.find(project => project.url.includes(sgyCourseTitle));

            // create a new event object
            let notionEvent = new Event(
                event.id,
                event.title,
                "Tasks",
                event.start.split(" ")[0],
                "Medium",
                projectPage.id, 
                "To Do"
            );

            // add event to new row in the master DB
            await notion.createRowInMaster(notionEvent)

        }

    })

})()