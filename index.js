require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const schoology = require('./schoology.js');
const notion = require('./notion.js');
const util = require('./util.js');
const { Event } = require('./Event.js');

(async () => {

    // get events from schoology (7 day range)
    const sgyEvents = await schoology.getUserEvents(process.env.SCHOOLOGY_USER_ID, "2022-02-7");

    let events = [];
    sgyEvents.forEach((event) => {

        if (event.type === "assignment") {
            let notionEvent = new Event(
                event.id,
                event.title,
                "Tasks",
                event.start.split(" ")[0],
                "Medium",
                1234,
                "To Do"
            );
            events.push(notionEvent);
        }

    })

    console.log(events)

    // const databaseID = process.env.NOTION_DATABASE_ID;

    // create a row in the master database
    // await notion.createRowInMaster(databaseID, "Big important deadline", "Tasks", util.getISODate(), "High", "5648a1520bf949e2a6ace594f134f796", "In Progress");
})()