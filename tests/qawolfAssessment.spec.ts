//Commenting out this import statement for now
//import { test } from '@playwright/test';

const { chromium } = require("playwright");

//Helper function to convert age text into numeric minutes
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
  var browser = await chromium.launch({ headless: false });
  var context = await browser.newContext();
  var page = await context.newPage();

  //Go to Hacker News "newest" page
  await page.goto("https://news.ycombinator.com/newest", {
    waitUntil: 'domcontentloaded'
  });

  var times = [];

  //Pagination: keep collecting until we reach 100
  while (times.length < 100) {
    var elements = await page.$$('.age');

    for (var i = 0; i < elements.length && times.length < 100; i++) {
      var text = await elements[i].innerText();
      times.push(text);
    }

    if (times.length >= 100) {
      break;
    }

    var moreButton = await page.$('a.morelink');
    if (!moreButton) {
      console.error("No more pages available before reaching 100 items");
      await browser.close();
      process.exit(1);
    }

    await moreButton.click();
    await page.waitForLoadState('domcontentloaded');
  }

  //Confirm exactly 100 timestamps collected
  if (times.length !== 100) {
    console.error('Wait a sec...Expected 100 articles, found ' + times.length);
    await browser.close();
    process.exit(1);
  }

  //Validate sorting: newest to oldest
  var sorted = true;
  for (var j = 1; j < times.length; j++) {
    var prev = parseAge(times[j - 1]);
    var curr = parseAge(times[j]);

    if (curr < prev) { //found a sorting issue
      sorted = false;
      break;
    }
  }

//Print result
  if (sorted) {
    console.log('SUCCESS! The first 100 articles are sorted correctly.');
  } else {
    console.error('FAIL: Articles are NOT sorted correctly.');
  }

 //Close browser
  await browser.close();
}

//Run the function immediately
(async function () {
  await sortHackerNewsArticles();
})();
