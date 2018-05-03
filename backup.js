const { policyBackup } = require('./policies');
const { conditionBackup } = require('./conditions');
const { channelBackup } = require('./channels');

const router = (method, license_key) => {
    method.toLowerCase();
    switch(method) {
        case 'all':
            backupAll(license_key);
            break;
        case 'policies':
            policyBackup();
            break;
        case 'conditions':
            console.log('To be implemented');
            break;
        case 'channels':
            channelBackup();
            break;
        default:
            console.log('Command not found, please use --help to see all available options');
    }
}

const backupAll = async (license_key) => {
    await policyBackup(license_key);
    await channelBackup(license_key);
    conditionBackup(license_key);
}

module.exports.backupRouter = router;