class Duplicate {

    /**
     * Object to create pairs of Schoology events and Notion pages that have the same title
     * @param {SchoologyEvent} sgyEvent Schoology Event object
     * @param {NotionPage} notionPage Notion Page object
     */
    constructor(sgyEvent, notionPage) {
        this.sgyEvent = sgyEvent;
        this.notionPage = notionPage;
    }

    /**
     * Searches through Schoology events and Notion pages to find a set of events/pages that have the same title (duplicates) 
     * @param {SchoologyEvent[]} sgyEvents Array of Schoology Event objects
     * @param {NotionPage[]} notionEvents Array of Notion Page objects
     * @returns {Duplicate[]} Array of Duplicate objects
     */
    static findDuplicates(sgyEvents, notionPages) {
        let duplicates = [];

        for (let i = 0; i < sgyEvents.length; i++) {
            for (let j = 0; j < notionPages.length; j++) {
                if (sgyEvents[i].title === notionPages[j].title) {
                    duplicates.push(new Duplicate(sgyEvents[i], notionPages[j]));
                }
            }
        }
        return duplicates;
    }

    /**
     * Searches through a set of duplicates to find those that have different dates (duplicates to update)
     * @param {Duplicate[]} duplicates Array of Duplicate objects
     * @returns {Duplicate[]} Array of Duplicate objects
     */
    static findDuplicatesToUpdate(duplicates) {
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

}

module.exports = {
    Duplicate
}