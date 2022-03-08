if (process.env.NODE_ENV === "production") {
    require('dotenv').config({ path: '/home/graham/notion-schoology-integration/.env' });
} else {
    require('dotenv').config({ path: './.env' });
}

const util = require('./util.js');
const schoology = require('./schoology.js');
const notion = require('./notion.js');
const { Event } = require('./classes/Event.js');
const { SchoologyEvent } = require('./classes/SchoologyEvent.js');
const { NotionPage } = require('./classes/NotionPage.js');
const { Entry } = require('./classes/Entry.js');

// TODO: Add error handling
// TODO: Less loops, faster code
// TODO: Make sgyEvent and notionEntry classes?
// Make Notion and Schoology classes? extend these for everything else?
(async () => {

    const scrapeStartDate = "2022-03-03";

    // get events from schoology & notion (7 day range default)
    let sgyEvents = await schoology.getUserEvents(process.env.SCHOOLOGY_USER_ID, scrapeStartDate);
    // filter is a hacky workaround for the weird date range issue with the schoology API (could be an issue with my dates/timezones)
    sgyEvents = sgyEvents.filter(event => {
        return event.start >= scrapeStartDate && event.start <= util.getISODate();
    }).map((event) => {
        return new SchoologyEvent(event);
    })

    let notionPages = await notion.getEntries(scrapeStartDate);
    notionPages = notionPages.map((entry) => {
        return new NotionPage(entry);
    })

    // TODO: Check for new events using the duplicates rather than stopping the program based on duplicates

    // check for duplicate entries (find?)
    const duplicates = Entry.findDuplicates(sgyEvents, notionPages);
    const newEntries = await Entry.findNewEntries(sgyEvents, duplicates);

    // finish moving code from duplicates into entries, finish finding the new events 
    //find new events
    //find events to update

    if (duplicates.length > 0) {

        console.info(`${util.logDatetime()} Duplicate entries found, checking for entries to update...`);
        const entriesToUpdate = Entry.findEntriesToUpdate(duplicates);

        if (entriesToUpdate.length > 0) {
            console.info(`${util.logDatetime()} Entries to update found. Updating...`);
            Entry.update(entriesToUpdate);
        } else {
            console.info(`${util.logDatetime()} No entries to update found.`);
        }

    } else {
        console.info(`${util.logDatetime()} No duplicate entries found.`);
    }

    // check if any duplicate needs to be updated

    if (newEntries.length > 0) {

        console.info(`${util.logDatetime()} New entries found, creating...`);
        Entry.createEntries(newEntries);

    } else {
        console.info(`${util.logDatetime()} No new entries found in schoology`);
    }

})()