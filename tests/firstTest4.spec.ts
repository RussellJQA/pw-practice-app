import {test} from '@playwright/test'

// A file can have both a file-level beforeEach and test.describe-level beforeEaches
test.beforeEach(async({page}) => {
    console.log('Running beforeEach');
    await page.goto('http://localhost:4200'); // First need to "run" app using "npm start"
    await page.getByText('Forms').click(); 
    await page.getByText('Form Layouts').click();
})

test('Locator syntax rules', async ({page}) => {
    //by Tab name
    await page.locator('input').first().click();

    //by ID
    // await page.locator('#inputEmail1').click()

    //by Class value
    page.locator('.shape-rectangle')

    //by attribute
    page.locator('[placeholder="Email"]')

    //by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //combine different selector (by tag and attribute and Class value)
    page.locator('input[placeholder="Email"].shape-rectangle')

    //combine different selector (by tag and 2 attributes)
    page.locator('input[placeholder="Email"][nbinput="" ]')

    // by XPath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail"]')

    // by partial text match
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text-is("Using the Grid")')
})