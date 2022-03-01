class NotionPage {
    constructor(notionPage) {
        this.id = notionPage.id;
        this.databaseID = notionPage.parent.database_id;
        this.title = notionPage.properties.Name.title[0].text.content;
        this.database = notionPage.properties.Database.select.name || "Tasks";
        this.date = notionPage.properties.Date.date.start;
        this.priority = notionPage.properties.Priority.multi_select[0].name || "Medium";
        this.status = notionPage.properties.Status.select.name || "To Do";
        this.projectRelationID = notionPage.properties.Project.relation[0].id;
        this.notes = (notionPage.properties.Notes.rich_text[0]) ? notionPage.properties.Notes.rich_text[0].plain_text : "";
    }
}

module.exports = {
    NotionPage
}