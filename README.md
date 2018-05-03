# NR Alert Migration Utility

## Overview

Alert Migrator is a Node.js CLI utility that allows you to backup your non-default New Relic alerts via the API so that you can migrate over to alerts v2.  The utility backs up alert policies, notification channels, and conditions in a JSON file that is stored locally.  Once the account has been switched over to alerts v2 the utility can be used to recreate the alerts in the new system by reading the JSON backup files and sending them back into New Relic through the API.

**Note**: This tool is not affiliated with New Relic and is in no way endorsed by them. If there're issues with the tool or questions about the source please open a new issue in this repository.




## Installation Instructions

1. Git clone this repository
2. In the root of the cloned repository create a folder named “data” (where the JSON files will be stored) and in the data directory create a new directory called “conditions”

## Usage Instructions

This utility provides two main commands that can be used, the backup command and the restore command and can operate on 1 account or sub account at a time.  In order to ensure accurate backups & restores make sure to move or remove the items from the data directory before running the utility on another account or sub-account.  To run the commands you will need to use the admin api key for the account (more info on this can be found [here](https://docs.newrelic.com/docs/apis/getting-started/intro-apis/access-rest-api-keys)).

To backup alerts run the following command from the root of the directory you cloned

```node app.js backup all <LICENSE_KEY>```

After backing up the alerts and migrating over to alerts v2, you can run the following command to restore the alerts

```node app.js backup all <LICENSE_KEY>```
