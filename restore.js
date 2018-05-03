const { policyRestore } = require('./policies');
const { conditionRestore } = require('./conditions');
const { channelRestore } = require('./channels');

const router = (method, license_key) => {
    method.toLowerCase();
    switch(method) {
        case 'all':
            restoreAll(license_key);
            break;
        default:
            console.log('Command not found, please use --help to see all available options');
    }
}

const restoreAll = async (license_key) => {
    await policyRestore(license_key);
    await conditionRestore(license_key);
    channelRestore(license_key);
}

module.exports.restoreRouter = router;