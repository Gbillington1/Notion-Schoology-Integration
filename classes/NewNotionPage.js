const { Client } = require('@notionhq/client');

const notion = new Client({
    auth: process.env.NOTION_TOKEN
});

class NewNotionPage {
    constructor(sgyEvent) {
        this.title = sgyEvent.title;
        this.date = sgyEvent.date;
        this.database = sgyEvent.database ?? "Tasks"; // find way to make this dynamic
        this.priority = sgyEvent.priority ?? "Medium"; // find way to make this dynamic
        this.status = sgyEvent.status ?? "To Do"; // find way to make this dynamic
        this.projectRelationID = sgyEvent.projectRelationID ?? null;
        this.notes = sgyEvent.notes ?? "";
    }

    async setProjectRelationID(relationID) {
        this.projectRelationID = relationID;
    }

    async createInMaster() {
        return notion.pages.create({
            parent: { database_id: process.env.NOTION_MASTER_DATABASE_ID },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: this.title,
                            },
                        },
                    ],
                },
                Database: {
                    select: {
                        name: this.database,
                    },
                },
                Date: {
                    date: {
                        start: this.date,
                    },
                },
                Priority: {
                    multi_select: [
                        {
                            name: this.priority,
                        }
                    ]
                },
                Project: {
                    relation: [
                        {
                            id: this.projectRelationID,
                        },
                    ],
                },
                Status: {
                    select: {
                        name: this.status,
                    },
                },
            },
        });
    }

}

module.exports = {
    NewNotionPage
}