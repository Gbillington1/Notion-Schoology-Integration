require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const schoology = require('./schoology.js');
const notion = require('./notion.js');
const util = require('./util.js');

(async () => {
    
    // get events from schoology (7 day range)
    const events = await schoology.getUserEvents(process.env.SCHOOLOGY_USER_ID);
    console.log(events)


    // const databaseID = process.env.NOTION_DATABASE_ID;

    // create a row in the master database
    // await notion.createRowInMaster(databaseID, "Big important deadline", "Tasks", util.getISODate(), "High", "5648a1520bf949e2a6ace594f134f796", "In Progress");
})()