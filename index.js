/**
 * jobcanで現在時刻を打刻修正します
 */
const puppeteer = require('puppeteer-core');
const edgePaths = require("edge-paths");
const chromePaths = require("chrome-paths");
const EDGE_PATH = edgePaths.getEdgePath();
const CHROME_PATH = chromePaths.chrome;

require('dotenv').config();
const USER = process.env.JOBCAN_USER;
const PASS = process.env.JOBCAN_PASS;
const url_login = 'https://id.jobcan.jp/users/sign_in?app_key=atd';
const url_mod = 'https://ssl.jobcan.jp/employee/adit/modify/';
const url_list = 'https://ssl.jobcan.jp/employee/attendance';
const moment = require('moment');
const NOW = moment().format('HHmm');

puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: false,
    executablePath: CHROME_PATH
    //slowMo: 10
}).then(async browser => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    // login
    await page.goto(url_login);
    await page.waitForSelector('input[name="commit"]', {timeout: 10000});
    await page.type("#user_email", USER);
    await page.type("#user_password", PASS);
    await page.click('input[name="commit"]');

    // top
    await page.waitForSelector('#all-footer', {timeout: 100000});

    // mod
    await page.goto(url_mod);
    await page.waitForSelector('#all-footer', {timeout: 100000});
    await page.type("#ter_time", NOW);
    await page.click('#insert_button');

    // list
    await page.goto(url_list);
    await page.waitForSelector('#all-footer', {timeout: 100000});
    await page.waitFor(10000);

    browser.close();
});
