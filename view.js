const { policyView} = require('./policies');
const { channelView } = require('./channels');
const { conditionView } = require('./conditions');

const router = (method) => {
    method.toLowerCase();
    switch(method) {
        case 'all':
            console.log('To be implemented');
            break;
        case 'policies':
            policyView();
            break;
        case 'conditions':
            conditionView();
            break;
        case 'channels':
            channelView();
            break;
        default:
            console.log('Command not found, please use --help to see all available options');
    }
}

module.exports.viewRouter = router;