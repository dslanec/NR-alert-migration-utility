const program = require('commander');
const { backupRouter } = require('./backup');
const { viewRouter } = require('./view');
const { restoreRouter } = require('./restore');

program
    .version('0.0.1')
    .description('Alert management utility');

program
    .command('backup <method> <license_key>')
    .description('Backup New Relic Alert components')
    .action((method, license_key) => {
        backupRouter(method, license_key);
    });

program
    .command('view <method>')
    .description('View backup data for New Relic Alert components')
    .action((method) => {
        viewRouter(method);
    });

program
    .command('restore <method> <license_key>')
    .description('Restore backup data for New Relic Alert components')
    .action((method, license_key) => {
        restoreRouter(method, license_key);
    });

program.parse(process.argv);