const nock = require('nock');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = require('chai').expect;
const chalk = require('chalk');

chai.use(sinonChai);

const convertBTC = require('../src/ConvertBTC');

describe('ConvertBTC', () => {
    var consoleStub;

    const responseMock = {
        success: true,
        price: 8582.48,
        time: "2018-05-13 14:14:03"
    };

    beforeEach(() => {
        consoleStub = sinon.stub(console, 'info');
    });

    afterEach(() => {
        console.info.restore();
    });

    it('should use currency USD and 1 as amount default', async () => {
        nock('https://apiv2.bitcoinaverage.com')
            .get('/convert/global')
            .query({ from: 'BTC', to: 'USD', amount: 1 })
            .reply(200, responseMock);

        await convertBTC();

        expect(consoleStub).to.have.been.calledWith(`${chalk.red(1)} BTC to ${chalk.cyan('USD')} = ${chalk.yellow(8582.48)}`);
    });

    it('should ise currency USD and 10 as amount', async() => {
        nock('https://apiv2.bitcoinaverage.com')
            .get('/convert/global')
            .query({ from: 'BTC', to: 'USD', amount: 10 })
            .reply(200, responseMock);

        await convertBTC('USD', 10);

        expect(consoleStub).to.have.been.calledWith(`${chalk.red(10)} BTC to ${chalk.cyan('USD')} = ${chalk.yellow(8582.48)}`);
    });

    it('should use currency BRL and 1 as amount default', async() => {
        nock('https://apiv2.bitcoinaverage.com')
            .get('/convert/global')
            .query({ from: 'BTC', to: 'BRL', amount: 1 })
            .reply(200, responseMock);

        await convertBTC('BRL');

        expect(consoleStub).to.have.been.calledWith(`${chalk.red(1)} BTC to ${chalk.cyan('BRL')} = ${chalk.yellow(8582.48)}`);
    });

    it('should message user when api reply with error', (done) => {
        nock('https://apiv2.bitcoinaverage.com')
            .get('/convert/global')
            .query({ from: 'BTC', to: 'USD', amount: 10 })
            .replyWithError('Error');

        convertBTC('USD', 10);

        setTimeout(() => {
            expect(consoleStub).to.have.been.calledWith(chalk.red('Something went wrong in the API. Try in a few minutes.'));
            done();
        }, 300);
    });
});