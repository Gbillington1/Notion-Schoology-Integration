const { NewNotionPage } = require('./NewNotionPage.js');
const { Client } = require('@notionhq/client');
const util = require("../util.js");

const notion = new Client({
    auth: process.env.NOTION_TOKEN
});

class NotionPage extends NewNotionPage {
    constructor(notionPage) {
        super({
            title: notionPage.properties.Name.title[0].text.content,
            date: notionPage.properties.Date.date.start,
            database: notionPage.properties.Database.select.name,
            priority: notionPage.properties.Priority.multi_select[0].name,
            status: notionPage.properties.Status.select.name,
            projectRelationID: notionPage.properties.Project.relation[0].id,
            notes: (notionPage.properties.Notes.rich_text[0]) ? notionPage.properties.Notes.rich_text[0].plain_text : ""
        })
        this.id = notionPage.id || null;
        this.databaseID = notionPage.parent.database_id || null;
    }

}

module.exports = {
    NotionPage
}