const fs = require('fs');
const puppeteer = require('puppeteer');
const { insertDecimal } = require('./utils');
const MAX_PAGE = 30116;

const numbers = {};

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  for (var i = MAX_PAGE; i > 0; i--) {
    console.warn(
      '\x1b[4m',
      'CURRENT PAGE: ' +
        i +
        '---' +
        'PAGES COUNT: ' +
        Object.keys(numbers).length
    );
    try {
      let numbersInPage = [];
      await page.goto(
        `https://chonso.mobifone.vn/tracuu/search.html?search_type=advanced&dauso=10&so=&loaiso=0&loaithuebao=tratruoc&tinhtrang=trongkho&khuvuc=0&captcha=&page=${i}&p=true`
      );
      await page.$('table');

      const numberEls = await page.$$(
        'td.fixed-column[style="text-align: center;"]'
      );
      for (const numEle of numberEls) {
        const number = await numEle.evaluate(e => e.textContent);
        if (number.trim().endsWith('4')) continue;
        const formattedNumber = insertDecimal(number.trim());
        numbersInPage.push(formattedNumber);
      }
      numbers['page_' + i] = numbersInPage;
    } catch (error) {
      console.error(error.message);
      break;
    } finally {
      await fs.writeFile('./phones.json', JSON.stringify(numbers), () => {
        console.log('wrote to fille');
      });
    }
  }
  // await page.screenshot({ path: 'example.png' });
  await page.waitForTimeout(10000);
  await browser.close();
})();

async function writeToFile() {}
