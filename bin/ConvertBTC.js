'use strict';

var request = require('request-promise-native');
var chalk = require('chalk');
var ora = require('ora');

var spinner = ora({
    text: 'Retrieving Bitcoin data...',
    color: 'yellow'
});

function convertBTC(currency, amount) {
    if (!currency) currency = 'USD';
    if (!amount) amount = 1;

    var url = 'https://apiv2.bitcoinaverage.com/convert/global?from=BTC&to=' + currency + '&amount=' + amount;

    spinner.start();
    return request(url).then(function (body) {
        spinner.stop();
        return body;
    }).then(function (body) {
        var apiResponse = JSON.parse(body);
        console.info(chalk.red(amount) + ' BTC to ' + chalk.cyan(currency) + ' = ' + chalk.yellow(apiResponse.price));
    }).catch(function (err) {
        console.info(err);
        spinner.stop();
        console.info(chalk.red('Something went wrong in the API. Try in a few minutes.'));
    });
}

module.exports = convertBTC;