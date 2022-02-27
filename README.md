# Schoology Events x Notion Integration
A NodeJS project that uses the [Schoology API](https://developers.schoology.com/api) and the [Notion API](https://developers.notion.com/) to get user assignments from Schoology and import them into a Notion database.

## Summary
Currently imports data into a Notion database with the following schema: 
```js
{
    "title": "My Task",
    "database": "Tasks",
    "date": "2022-02-07",
    "priority": "High",
    "projectPageID": "id of notion page to link to task",
    "status": "To Do"
}
```

To get the `projectPageID`, you must have a Notion database filled with pages (projects) that *contain* the schoology course name in their name (e.g. "AP Calculus", "AP English", "Fin Lit II"). The integration then matches the schoology course with the correct page in the Notion database by name, and finds the `projectPageID`  

## Usage
To run this program, first clone this repository:
```
git clone https://github.com/gbillington1/notion-schoology-integration.git
```
Then, install the necessary node modules:
```
npm install
```
You will need the following environment variables to successfully run the program:
```py
# found at https://app.schoology.com/api
SCHOOLOGY_CONSUMER_KEY
SCHOOLOGY_CONSUMER_SECRET

# navigate to your profile in schoology and get the ID from the URL
SCHOOLOGY_USER_ID 

# go to https://notion.so/my-integrations to create a new internal integration and get the token
NOTION_TOKEN 
# databaseID to add assignments to - must follow above schema
NOTION_MASTER_DATABASE_ID 
# databaseID containing Schoology courses in the form of Notion pages
NOTION_PROJECTS_DATABASE_ID 
```
Make sure that your Notion Master Database is shared with the Notion Integration that you created to get the `NOTION_TOKEN`, and then run:
```
node index.js
```
in the `notion-schoology-integration` folder. All of your assignments that fall within a week from the program execution date will be inserted into your Notion database. You can change the range of dates in the `schoology.getUserEvents()` function.

### Feedback
Please feel free to give me any feedback through issues or pull requests!