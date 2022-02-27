#!/usr/bin/bash
# this file is copied over to /usr/bin/ when deployed to server
# the actual script used in cronjob stored in /usr/bin/
/usr/local/bin/node /home/graham/notion-schoology-integration/index.js >> /home/graham/notion-schoology-integration/cron.log