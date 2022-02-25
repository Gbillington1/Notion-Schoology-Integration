const { Client } = require('@notionhq/client');

const notion = new Client({
    auth: process.env.NOTION_TOKEN
});

// creates a row in the master database
async function createRowInMaster(databaseID, title, database, date, priority, projectPageID, status) {
    const response = await notion.pages.create({
        parent: { database_id: databaseID },
        properties: {
            Name: {
                title: [
                    {
                        text: {
                            content: title,
                        },
                    },
                ],
            },
            Database: {
                select: {
                    name: database,
                },
            },
            Date: {
                date: {
                    start: date,
                },
            },
            Priority: {
                multi_select: [
                    {
                        name: priority,
                    }
                ]
            },
            Project: {
                relation: [
                    {
                        id: projectPageID,
                    },
                ],
            },
            Status: {
                select: {
                    name: status,
                },
            },
        },
    });
}

module.exports = {
    createRowInMaster
}