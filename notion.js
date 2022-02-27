const { Client } = require('@notionhq/client');
const util = require("./util.js");

const notion = new Client({
    auth: process.env.NOTION_TOKEN
});

// creates a row in the master database
async function createRowInMaster(event) {
    const response = await notion.pages.create({
        parent: { database_id: process.env.NOTION_MASTER_DATABASE_ID },
        properties: {
            Name: {
                title: [
                    {
                        text: {
                            content: event.title,
                        },
                    },
                ],
            },
            Database: {
                select: {
                    name: event.database,
                },
            },
            Date: {
                date: {
                    start: event.date,
                },
            },
            Priority: {
                multi_select: [
                    {
                        name: event.priority,
                    }
                ]
            },
            Project: {
                relation: [
                    {
                        id: event.projectPageID,
                    },
                ],
            },
            Status: {
                select: {
                    name: event.status,
                },
            },
        },
    });
}

// find section ID's for every course in schoology, pair it with the page ID of the corresponding page in the master DB 
async function getCourseProjects() {
    // get page IDs from Projects db
    const response = await notion.databases.query({
        database_id: process.env.NOTION_PROJECTS_DATABASE_ID,
        filter: {
            property: "Tags",
            multi_select: {
                contains: "Course",
            },
        },
    })
    return response.results;
}

// gets tasks and deadlines in the master database that are within a 7 day range by default
async function getEntries(startDate = util.getISODate(), endDate = util.addDaysToDate(startDate, 7)) {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_MASTER_DATABASE_ID,
        filter: {
            and: [
                {
                    property: "Date",
                    date: {
                        on_or_after: startDate,
                    }
                },
                {
                    property: "Date",
                    date: {
                        on_or_before: endDate,
                    },
                },
            ]
        },
    })
    return response.results; 
}

async function updateEntry(entryToUpdate, entryFromSchoology) {
    const notionEntryID = entryToUpdate.id;
    
    const response = await notion.pages.update({
        page_id: notionEntryID,
        properties: {
            Date: {
                date: {
                    start: entryFromSchoology.date,
                },
            },
        },
    })

    return response;

}

module.exports = {
    createRowInMaster,
    getCourseProjects,
    getEntries,
    updateEntry
}