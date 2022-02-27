if (process.env.NODE_ENV === "production") {
    require('dotenv').config({ path: '/home/graham/notion-schoology-integration/.env' });
} else {
    require('dotenv').config({ path: './.env' });
}

const { v4: uuidv4 } = require('uuid');
const schoology = require('./schoology.js');
const notion = require('./notion.js');
const util = require('./util.js');
const { Event } = require('./Event.js');

(async () => {

    // get events from schoology (7 day range default)
    const sgyEvents = await schoology.getUserEvents(process.env.SCHOOLOGY_USER_ID);

    // get events from notion (7 day range default)
    const notionTasksAndDeadlines = await notion.getTasksAndDeadlines()

    // get page objects with the tag "Course"
    const notionProjects = await notion.getCourseProjects();

    // filter out events that aren't assignments
    sgyEvents.filter((event) => {
        return event.type === "assignment";
    }).forEach(async (event) => {
        
        // check if event is already in the notion database
        const duplicateEntry = notionTasksAndDeadlines.find(task => {
            return (task.properties.Name.title[0].plain_text === event.title && task.properties.Date.date.start == event.start.split(" ")[0])
        })

        // handle duplicate entries
        // TODO: abstract this in a clean way, figure out the best way to skip and update tasks
        // notionTasksAndDeadlines.filter((task) => {
        //     return task.properties.Name.title[0].plain_text === event.title
        // }).forEach(async (task) => {
        //     const taskStartDate = task.properties.Date.date.start
        //     const eventDate = event.start.split(" ")[0]

        //     if (taskStartDate == eventDate) {
        //         // duplicate, skip
        //     } else if (taskStartDate != eventDate) {
        //         // update date of task in notion using event.id
        //     }
        // });

        // skip duplicates 
        if (duplicateEntry) {
            console.log(`Skipped creation, entry already exists: ${event.title}`);
            return
        }

        // get title of course from from /sections/{id}
        const sgyCourse = await schoology.getCourseSection(event.section_id);
        const sgyCourseTitle = sgyCourse.course_title.replace(/\s+/g, '-');

        // find page in notion that matches the schoology event course
        const projectPage = notionProjects.find(project => project.url.includes(sgyCourseTitle));

        // create a new event object
        let notionEvent = new Event(
            event.id,
            event.title,
            "Deadlines",
            event.start.split(" ")[0],
            "Medium",
            projectPage.id,
            "To Do"
        );

        // add event to new row in the master DB
        await notion.createRowInMaster(notionEvent)

        console.log("Successfully added event to Notion: " + notionEvent.title);

    })

})()