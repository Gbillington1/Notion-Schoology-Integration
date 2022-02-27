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

// TODO: Add error handling
// TODO: Less loops, faster code
(async () => {

    // get events from schoology (7 day range default)
    let sgyEvents = await schoology.getUserEvents(process.env.SCHOOLOGY_USER_ID);

    // get page objects with the tag "Course"
    const notionProjects = await notion.getCourseProjects();

    // filter out events that aren't assignments
    sgyEvents = sgyEvents.filter((event) => {
        return event.type === "assignment"
    })

    // create all pending notion entries
    let entriesFromSchoology = [];

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

    const existingEntries = await notion.getEntries()

    // check if any events are already in the master database, update duplicates if their dates are incorrect, add non duplicates
    entries: for (let i = 0; i < entriesFromSchoology.length; i++) {

        // find duplicate entries
        const duplicateEntries = existingEntries.filter((entry) => {
            return entry.properties.Name.title[0].plain_text === entriesFromSchoology[i].title
        })

        // skip or update duplicate entries
        duplicates: for (let j = 0; j < duplicateEntries.length; j++) {

            const assignmentDate = entriesFromSchoology[i].date;
            const currentEntryDate = duplicateEntries[j].properties.Date.date.start;

            if (assignmentDate == currentEntryDate) {
                console.log(`Skipped creation, entry already exists: ${entriesFromSchoology[i].title}`);
                // skip iteration of both loops
                continue entries;

            } else if (assignmentDate != currentEntryDate) {
                // update entry
                notion.updateEntry(duplicateEntries[j], entriesFromSchoology[i]);
                console.log(`Updated task: ${duplicateEntries[j].properties.Name.title[0].plain_text}`);
                // skip iteration of both loops
                continue entries;
            }
        }

        // add event to new row in the master DB
        await notion.createRowInMaster(entriesFromSchoology[i])
        console.log(`Successfully added entry to Notion: ${entriesFromSchoology[i].title}`);

    }
})()