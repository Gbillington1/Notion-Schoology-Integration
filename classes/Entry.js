const { NewNotionPage } = require('./NewNotionPage.js');
const { NotionPage } = require('./NotionPage.js')
const { Client } = require('@notionhq/client');
const util = require("../util.js");

const notion = new Client({
    auth: process.env.NOTION_TOKEN
});

class Entry {
    constructor(sgyEvent, notionPage) {
        this.sgyEvent = sgyEvent;
        this.notionPage = notionPage;
    }

    /**
     * Searches through Schoology events and Notion pages to find a set of events/pages that have the same title (duplicates) 
     * @param {SchoologyEvent[]} sgyEvents Array of Schoology Event objects
     * @param {NotionPage[]} notionEvents Array of Notion Page objects
     * @returns {Entry[]} Array of Entry objects
     */
    static findDuplicates(sgyEvents, notionPages) {
        let duplicates = [];

        for (let i = 0; i < sgyEvents.length; i++) {
            for (let j = 0; j < notionPages.length; j++) {
                if (sgyEvents[i].title === notionPages[j].title) {
                    duplicates.push(new Entry(sgyEvents[i], notionPages[j]));
                }
            }
        }
        return duplicates;
    }

    // check notion entreis against schoology events? or the other way around?
    static async findNewEntries(sgyEvents, duplicates) {
        let newEntries = [];

        for (let i = 0; i < sgyEvents.length; i++) {
            let isInDuplicates = false;
            for (let j = 0; j < duplicates.length; j++) {
                if (sgyEvents[i].title === duplicates[j].sgyEvent.title) {
                    isInDuplicates = true;
                }
            }

            // if not in duplicates, create Entry and add it to the return array
            if (!isInDuplicates) {
                const sgyEvent = sgyEvents[i];
                const newNotionPage = new NewNotionPage(sgyEvent);
                const projectRelationID = await sgyEvent.getProjectRelationID();
                newNotionPage.setProjectRelationID(projectRelationID);
                newEntries.push(new Entry(sgyEvent, newNotionPage));
            }
        }
        return newEntries;
    }

    /**
     * Searches through an array of duplicate Entry objects to find those that have different dates (duplicates to update)
     * @param {Entry[]} duplicates Array of Entry objects
     * @returns {Entry[]} Array of Entry objects
     */
    static findEntriesToUpdate(duplicates) {
        let updates = [];

        for (let i = 0; i < duplicates.length; i++) {
            const notionDate = duplicates[i].notionPage.date;
            const sgyDate = duplicates[i].sgyEvent.date;
            if (sgyDate != notionDate) {
                updates.push(duplicates[i]);
            }
        }
        return updates;
    }

    static createEntries(newEntries) {
        for (let i = 0; i < newEntries.length; i++) {

            newEntries[i].notionPage.createInMaster().then(response => {

                if (response.object === "page") {
                    console.info(`${util.logDatetime()} Created Notion Page ${newEntries[i].notionPage.title}`);
                }

            }).catch(error => {
                console.info(`${util.logDatetime()} Error creating Notion Page ${newEntries[i].notionPage.title}`);
                throw new Error(error);
            })

        }
    }

    /**
     * Update the date of a Notion pages given an array of Entry objects
     * @param {Entry[]} updates Array of Entry objects
     */
    static update(updates) {
        for (let i = 0; i < updates.length; i++) {

            updates[i].updateDate().then(response => {
                if (response.object === "page") {
                    console.info(`${util.logDatetime()} Updated date of Notion Page ${updates[i].notionPage.title} from ${updates[i].notionPage.date} to ${updates[i].sgyEvent.date}`);
                }
            }).catch(error => {
                console.info(`${util.logDatetime()} Error updating date of Notion Page ${updates[i].notionPage.title}`);
                throw new Error(error);
            });
        }
    }

    /**
     * Update the date of a Notion page
     * @returns 
     */
    async updateDate() {
        if (this.notionPage instanceof NotionPage) {
            return notion.pages.update({
                page_id: this.notionPage.id,
                properties: {
                    Date: {
                        date: {
                            start: this.sgyEvent.date,
                        },
                    },
                },
            })
        } else {
            throw new Error("Notion Page is not an instance of NotionPage");
        }
    }

}

module.exports = {
    Entry
}