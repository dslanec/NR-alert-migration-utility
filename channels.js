const fs = require('fs');
const rp = require('request-promise');
const { objectMap } = require('./policies');

const channelBackup = (license_key) => {
    return new Promise(async (resolve) => {
        const options = {
            url: 'https://api.newrelic.com/v2/alerts_channels.json',
            headers: {
                'X-Api-Key':license_key
            }
        };

        try {
            console.log('Backing up Alert Channels..')
            var result = await rp(options);
            fs.writeFileSync('./data/channels', result);
            console.log('Successfully Backed up ' + JSON.parse(result).channels.length + ' Alert Channels');
            resolve(null);
        } catch (error) {
            console.log(error);
        }
    });
}

const channelView = () => {
    try {
        var channels = fs.readFileSync('./data/channels');
        channels = JSON.parse(channels);
        console.dir(channels, {depth: null, colors: true});

    } catch (error) {
        console.log(error);
    }
}

const channelRestore = (license_key) => {
    return new Promise(async (resolve) => {
        try {
            console.log('Restoring notification channels');
            var channels = JSON.parse(fs.readFileSync('./data/channels')).channels;
            let data = await channelFormatter(channels);
            await associationUpdate(data, license_key);
            
            console.log('channel restoration process completed');
            resolve(null);
        } catch (error) {
            console.log('Error ')
        }
    });
}

const channelFormatter = (channels) => {
    return new Promise(async (resolve) => {
        try {
            const map = await objectMap();
            var data = {}
            for (var i in map) {
                data[i] = [];
            }
            channels.map(x => {
                const channel_id = x.id;
                x.links.policy_ids.map(y => {
                    data[y].push(channel_id);
                });
            });
            
            var result = {};
            for (var i in data) {
                if (data[i].length > 0) {
                    result[map[i]] = data[i];    
                }
            }
            resolve(result);
        } catch (error) {
            console.log(`Error formatting channels: ${error}`);
        }
    });
}

const associationUpdate = (data, license_key) => {
    return new Promise(async (resolve) => {
        try {
            if (Object.keys(data).length === 0 && data.constructor === Object) {
                resolve(null);
            } else {
                for (var x in data) {
                    const options = {
                        url: `https://api.newrelic.com/v2/alerts_policy_channels.json?policy_id=${x}&channel_ids=${data[x].toString()}`,
                        headers: {
                            'X-Api-Key': license_key
                        },
                        method: 'PUT',
                        json: true,
                    };

                    await rp(options);
                }
                resolve(null);
            }
        } catch (error) {
            console.log(`error updating channel association: ${error}`);
        }
    });
}

module.exports = { channelBackup, channelView, channelRestore };