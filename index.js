require('dotenv').config();
const { Client } = require('@notionhq/client');

const notion = new Client({
    auth: process.env.NOTION_TOKEN
});

(async () => {
    const databaseID = process.env.NOTION_DATABASE_ID;

    // date formatting
    const datetime = new Date();
    const adjustedDatetime = new Date(datetime.getTime() - (datetime.getTimezoneOffset() * 60000));
    const date = adjustedDatetime.toISOString().split('T')[0];

    // create a row in the master database
    // TODO: break this up into functions
    const response = await notion.pages.create({
        parent: { database_id: databaseID },
        properties: {
            Name: {
                title: [
                    {
                        text: {
                            content: "Big important deadline",
                        },
                    },
                ],
            },
            Database: {
                select: {
                    name: "Deadlines",
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
                        name: "High",
                    }
                ]
            },
            Project: {
                relation: [
                    {
                        id: "5648a1520bf949e2a6ace594f134f796",
                    },
                ],
            },
            Status: {
                select: {
                    name: "In Progress",
                },
            },
        },
    });

})()
