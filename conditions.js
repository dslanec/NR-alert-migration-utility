const fs = require('fs');
const rp = require('request-promise');
const { policyListing } = require('./policies');

const collectConditions = async (policy_id, license_key) => {
    const options = {
        url: 'https://api.newrelic.com/v2/alerts_conditions.json?policy_id=' + policy_id,
        headers: {
            'X-Api-Key': license_key
        }
    };

    try {
        console.log('Backing up conditions for policy: ' + policy_id);
        var result = await rp(options);
        fs.writeFileSync('./data/conditions/policy_' + policy_id, result);
        console.log('Successfully Backed up ' + JSON.parse(result).conditions.length + ' conditions for policy ' + policy_id);
    } catch (error) {
        console.log(error);
    }
}

const conditionBackup = (license_key) => {
    var policies = policyListing();
    policies.map((x) => collectConditions(x.id, license_key));
}

const conditionView = () => {
    try {
        var policies = policyListing();
        policies.map(x => {
            if(fs.existsSync('./data/conditions/policy_' + x.id)) {
                var data = fs.readFileSync('./data/conditions/policy_' + x.id);
                data = JSON.parse(data);
                console.log(`Conditions for policy ${x.id}: ${x.name}\n`);
                console.dir(data, {depth: null, colors:true});
                console.log("\n");
            } else {
                Console.log(`Unable to load conditions for policy ${x.id}: ${x.name}, please ensure the policy and conditions were backed up`);
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const conditionRestore = (license_key) => {
    return new Promise(async (resolve) => {
        try {
            console.log('restoring conditions...');
            var policies = JSON.parse(fs.readFileSync('./data/policy_map'));
            let promises = policies.map(x => {
                return conditionCreator(x, license_key);
            });
            let results = await Promise.all(promises);
            console.log('Condition restoration completed');
            resolve(null);
        } catch (error) {
            console.log(`Error mapping through conditions: ${error}`);
        }
    });
}

const conditionCreator = async (policy, license_key) => {
    return new Promise(async (resolve) => {
        try {
            const conditions = JSON.parse(fs.readFileSync('./data/conditions/policy_' + policy.oldId)).conditions;
            conditions.map(async x => {
                delete x.id;
                const options = {
                    url: `https://api.newrelic.com/v2/alerts_conditions/policies/${policy.newId}.json`,
                    headers: {
                        'X-Api-Key':license_key
                    },
                    method: 'POST',
                    json: true,
                    body: {condition: x}
                }
                await rp(options);
            });
            resolve(null);
        } catch (error) {
            throw(`Error restoring conditions: ${error}`);
        }
    });
}

module.exports = {conditionBackup, conditionView, conditionRestore};