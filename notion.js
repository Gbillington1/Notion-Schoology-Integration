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

// handles task creation, updates, and duplicates
async function handleCreation(entriesFromSchoology) {

    const existingEntries = await getEntries(process.env.START_DATE);

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
                console.log(`[${util.getISODatetime}] Skipped creation, entry already exists: ${entriesFromSchoology[i].title}`);
                // skip iteration of both loops
                continue entries;

            } else if (assignmentDate != currentEntryDate) {
                // update entry
                updateEntry(duplicateEntries[j], entriesFromSchoology[i]);
                console.log(`[${util.getISODatetime}] pdated task: ${duplicateEntries[j].properties.Name.title[0].plain_text}`);
                // skip iteration of both loops
                continue entries;
            }
        }

        // add event to new row in the master DB
        await createRowInMaster(entriesFromSchoology[i])
        console.log(`[${util.getISODatetime}] Successfully added entry to Notion: ${entriesFromSchoology[i].title}`);

    }

}

module.exports = {
    createRowInMaster,
    getCourseProjects,
    getEntries,
    updateEntry,
    handleCreation
}