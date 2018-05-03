const fs = require('fs');
const rp = require('request-promise');

const policyBackup = (license_key) => {
    return new Promise(async (resolve) => {
        const options = {
            url: 'https://api.newrelic.com/v2/alerts_policies.json',
            headers: {
                'X-Api-Key': license_key
            }
        };

        try {
            console.log('Backing up Policies..')
            var result = await rp(options);
            fs.writeFileSync('./data/policies', result);
            console.log('Successfully Backed up ' + JSON.parse(result).policies.length + ' Policies');
            resolve(null);
        } catch (error) {
            console.log(error);
        }
    });
}

const policyView =  () => {
    try {
        var policies = fs.readFileSync('./data/policies');
        policies = JSON.parse(policies).policies;
        for (i=0; i < policies.length; i++) {
            console.log(`Name: ${policies[i].name}`);
            console.log(`ID: ${policies[i].id}`);
            console.log(`Incident Preference: ${policies[i].incident_preference}`);
            console.log(`Created: ${policies[i].created_at}`);
            console.log(`Updated: ${policies[i].updated_at}\n`);
        }

    } catch (error) {
        console.log(error);
    }
}

const policyListing = () => {
    try {
        if (fs.existsSync('./data/policies')) {
            var policies = JSON.parse(fs.readFileSync('./data/policies')).policies;
            var listing = [];
            policies.map(x => listing.push({id: x.id, name: x.name, incident_preference: x.incident_preference}));
            return listing;
        } else {
            throw('Unable to find backup file for policies, please ensure policies are backed up');
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

const policyCount = (license_key) => {
    return new Promise(async (resolve) => {
        const options = {
            url: 'https://api.newrelic.com/v2/alerts_policies.json',
            headers: {
                'X-Api-Key': license_key
            }
        };

        try {
            console.log('Gathering policy count...');
            var result = await rp(options);
            result = JSON.parse(result).policies
            if (result.length === 0) {
                console.log('No existing policies found, continuing with restore');
                resolve(null);    
            } else {
                throw(`Unable to restore policies, found ${result.length} existing policies in the account`);
            }
        } catch (error) {
            console.log(error);
        }
    });
}

const policyRestore = (license_key) => {
    return new Promise(async (resolve) => {
        await policyCount(license_key);
        var policies = policyListing();
        console.log('Recreating Policies');
        let promises = policies.map(x => {
            return policyCreator(x, license_key);
        });
        
        let results = await Promise.all(promises);
        fs.writeFileSync('./data/policy_map', JSON.stringify(results));
        console.log('Policies re-created and policies mapped');
        resolve(null);
    });
}

//needs admin api key
const policyCreator = async (policy, license_key) => {
    return new Promise(async (resolve) => {
        const options = {
            url: 'https://api.newrelic.com/v2/alerts_policies.json',
            headers: {
                'X-Api-Key':license_key
            },
            method: 'POST',
            json: true,
            body: {policy: policy}
        };

        try {
            var map = {name: policy.name, oldId: policy.id};
            const result = await rp(options);
            map.newId = result.policy.id;
            resolve(map);
        } catch (error) {
            console.log(`Error sending policy to New Relic: ${error}`);
        }
    });
}

const objectMap = () => {
    return new Promise((resolve) => {
        try {
            const originalMap = JSON.parse(fs.readFileSync('./data/policy_map'));
            var result = {};

            originalMap.map(x => {
                result[x.oldId] = x.newId.toString();
            });
            resolve(result);
        } catch (error) {
            console.log(`Error mapping keys: ${error}`);
        }
    });
}

module.exports = { policyBackup, policyView, policyListing, policyRestore, objectMap };