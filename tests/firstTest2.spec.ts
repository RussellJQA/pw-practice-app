import {test} from '@playwright/test'

// "async" is needed for "await" commands to work
test('the first test', async ({page}) => {

  // "await" is needed by those functions which return a "Promise" (which you can tell using Intellisense)
       // It waits for the Promise to be returned

  await page.goto('http://localhost:4200'); // First need to "run" app using "npm start"

  await page.getByText('Forms').click();

  await page.getByText('Form Layouts').click();
})

test('navigate to date picker page', async ({page}) => {

  // "await" is needed by those functions which return a "Promise" (which you can tell using Intellisense)
       // It waits for the Promise to be returned
  await page.goto('http://localhost:4200');

  await page.getByText('Forms').click();

  await page.getByText('Datepicker').click();
})