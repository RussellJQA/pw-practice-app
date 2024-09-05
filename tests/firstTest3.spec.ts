import {test} from '@playwright/test'

// A file can have both a file-level beforeAll and test.describe-level beforeAlls
test.beforeAll(async({page}) => {
    console.log('Running beforeAll');
})

// A file can have both a file-level beforeEach and test.describe-level beforeEaches
test.beforeEach(async({page}) => {
    console.log('Running beforeEach');
    await page.goto('http://localhost:4200'); // First need to "run" app using "npm start"
    await page.getByText('Forms').click(); 
})

// Use afterEach with caution
test.afterEach(async({page}) => {
    console.log('Running afterEach');
})

// Use afterEach with caution
test.afterAll(async({page}) => {
    console.log('Running afterAll');
})

test('the first test 3', async ({page}) => {
  await page.getByText('Form Layouts').click();
})

test('navigate to date picker page 3', async ({page}) => {
  await page.getByText('Datepicker').click();
})