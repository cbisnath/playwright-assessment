import { test } from '@playwright/test';

const { chromium } = require("playwright");

//Helper function to convert "X minutes/hours/days ago" into numeric minutes
function parseAge(text) {
  var parts = text.split(' ');
  var number = parseInt(parts[0], 10);
  var unit = parts[1];

  if (unit.indexOf('minute') === 0) {
    return number;
  } else if (unit.indexOf('hour') === 0) {
    return number * 60;
  } else if (unit.indexOf('day') === 0) {
    return number * 60 * 24;
  } else {
    //In case of unusual text
    return Number.MAX_SAFE_INTEGER;
  }
}

//Main function that performs the task
async function sortHackerNewsArticles() {
  //Launch browser
  var browser = await chromium.launch({ headless: false }); // set headless: true for CI
  var context = await browser.newContext();
  var page = await context.newPage();

  //Go to Hacker News "newest" page
  await page.goto("https://news.ycombinator.com/newest", { waitUntil: 'domcontentloaded' });

  //Get all elements with class '.age' (timestamps)
  var elements = await page.$$('.age');

  //Extract the first 100 timestamps safely
  var times = [];
  for (var i = 0; i < Math.min(100, elements.length); i++) {
    var text = await elements[i].innerText();
    times.push(text);
  }

  //Validate there are exactly 100 articles
  if (times.length !== 100) {
    console.error('Wait a sec! Expected 100 articles, found ' + times.length);
    await browser.close();
    process.exit(1);
  }

  //Validate the order: newest → oldest
  var sorted = true;
  for (var i = 1; i < times.length; i++) {
    var prev = parseAge(times[i - 1]);
    var curr = parseAge(times[i]);

    if (curr < prev) { //current is newer than previous → wrong order
      sorted = false;
      break;
    }
  }

  //Print result
  if (sorted) {
    console.log('Nice! The first 100 articles are sorted correctly (newest → oldest).');
  } else {
    console.error('Wait a sec! The articles are NOT sorted correctly.');
  }

  //Close browser
  await browser.close();
}

//Run the function immediately
(async function() {
  await sortHackerNewsArticles();
})();
