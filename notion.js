const { Client } = require('@notionhq/client');
const util = require("./util.js");

const notion = new Client({
    auth: process.env.NOTION_TOKEN
});

/** Get tasks and deadlines in the master database that are within a 7 day range by default
 * @param {string} startDate ISO 8601 date string of the date to start the search from
 * @param {string} endDate ISO 8601 date string of the date to end the search at
 * @returns {{Notion Page Resp}[]} Array of Notion pages that are in the master database and are within the given date range
 */
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

/**
 * Get a list of all the courses in the projects database
 * @returns {{Notion Page Resp}[]} Array of Notion pages that have the tag "Course" from the Notion API
 */
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

/**
 * Get a list of databases that the integration has access to
 * @returns {Promise<{Notion Database Resp}[]>} Array of Notion databases that are shared with the integration
 */
function getDatabases() {
    return notion.search({
        filter: {
            property: "object",
            value: "database"
        }
    })
}

module.exports = {
    getEntries,
    getCourseProjects,
    getDatabases
}