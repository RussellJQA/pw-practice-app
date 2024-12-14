import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200'); // First need to "run" app using "npm start"
})

test.describe('Form Layouts page', () => {

    test.beforeEach( async({page}) => {
        await page.getByText('Forms').click(); 
        await page.getByText('Form Layouts').click();
    })

    test('input fields', async({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "email"});
        await usingTheGridEmailInput.fill('test@test.com');
        await usingTheGridEmailInput.clear();
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay:500});

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue();
        expect(inputValue).toEqual('test2@test.com');

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com');
    })

    test('radio buttons', async({page}) => {
        const usingTheGridEmailForm = page.locator('nb-card', {hasText: "Using the Grid"});

        // "force: true" is needed because the corresponding <input> has "visually-hidden" class
        // await usingTheGridEmailForm.getByLabel('Option 1').check({force: true}); // 1 alternative
        await usingTheGridEmailForm.getByRole('radio', {name: "Option 1"}).check({force: true}); // another alternative
        const radioStatus = await usingTheGridEmailForm.getByRole('radio', {name: 'Option 1'}).isChecked();

        // generic assertion
        expect(radioStatus).toBeTruthy();

        //locator assertion
        await expect(usingTheGridEmailForm.getByRole('radio',{name: 'Option 1'})).toBeChecked();

        // Verify that "Check"-ing the 2nd option un-checks the 1st option
        await usingTheGridEmailForm.getByRole('radio', {name: "Option 2"}).check({force: true});
        expect(await usingTheGridEmailForm.getByRole('radio', {name: 'Option 1'}).isChecked()).toBeFalsy();
        expect(await usingTheGridEmailForm.getByRole('radio', {name: 'Option 2'}).isChecked()).toBeTruthy();
    })

    // A revised implementation by Russell Johnson, which seems somewhat cleaner
    test('radio buttons2', async({page}) => {
        const usingTheGridEmailForm = page.locator('nb-card', {hasText: "Using the Grid"});

        const radioButton1 = usingTheGridEmailForm.getByRole('radio', {name: "Option 1"})
        await radioButton1.check({force: true});

        // generic assertion
        const radioStatus1 = await radioButton1.isChecked();
        expect(radioStatus1).toBeTruthy();

        //locator assertion
        await expect(radioButton1).toBeChecked();

        // Verify that "Check"-ing the 2nd option un-checks the 1st option
        const radioButton2 = usingTheGridEmailForm.getByRole('radio', {name: "Option 2"})
        await radioButton2.check({force: true});
        expect(await radioButton1.isChecked()).toBeFalsy();
        expect(await radioButton2.isChecked()).toBeTruthy();
    })

})

test('check boxes', async({page}) => {
    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true});
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true});

    // Check all checkboxes on the page
    const allBoxes = page.getByRole('checkbox');
    for(const box of await allBoxes.all()) {
        await box.check({force: true});
        // expect(await box.isChecked()).toBeTruthy(); // This works, but TabNine suggests the following instead
        await expect(box).toBeChecked();
    }

    for(const box of await allBoxes.all()) {
        await box.uncheck({force: true});
        //expect(await box.isChecked()).toBeFalsy(); // This works, but TabNine suggests the following instead
        await expect(box).not.toBeChecked();
    }
})

test('lists and dropdowns', async({page}) => {
    const dropDownMenu = page.locator('ngx-header nb-select');
    await dropDownMenu.click();
    
    // page.getByRole('listitem'); // when the list item has a LI tag

    // const optionList = page.getByRole('list').locator('nb-option'); // Use this role when the list has a UL tag
    const optionList = page.locator('nb-option-list nb-option');
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);
    await optionList.filter({hasText: "Cosmic"}).click();

    const header = page.locator('nb-layout-header');
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)');

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    };

    await dropDownMenu.click();
    for(const color in colors){
        await optionList.filter({hasText: color}).click();
        await expect(header).toHaveCSS('background-color', colors[color]);
        if(color != "Corporate")
            await dropDownMenu.click();
    }
})

// A revised implementation by Russell Johnson, which seems somewhat cleaner
test('lists and dropdowns 2', async({page}) => {
    const dropDownMenu = page.locator('ngx-header nb-select');
    const optionList = page.locator('nb-option-list nb-option');
    const header = page.locator('nb-layout-header');

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    };  

    for(const color in colors){
        await dropDownMenu.click();
        await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]); // The order here is significant
        await optionList.filter({hasText: color}).click();
        await expect(header).toHaveCSS('background-color', colors[color]);
    }
})

// An alternative (but less clean) implementation by Russell Johnson, used to demonstrate looping through each of a dropdown menu's options
test('lists and dropdowns 3', async({page}) => {

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    };
    const colors_keys = Object.keys(colors);

    const dropDownMenu = page.locator('ngx-header nb-select');
    const optionList = page.locator('nb-option-list nb-option');

    await dropDownMenu.click(); // Dropdown the menu so that we can count the menu options and check all their text (at once)
    const optionCount = await optionList.count();
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]); // Checks all the dropdown menu's options' text at once
    await optionList.nth(0).click(); // Select a menu option in order to close the menu for now [so that the click()s below works as expected]

    const header = page.locator('nb-layout-header');

    for (let i = 0; i < optionCount; ++i) {

        await dropDownMenu.click();  // Dropdown the menu

        // This is redundant with toHaveTest() above, but is included for demonstration purposes
        await expect(optionList.nth(i)).toHaveText(colors_keys[i]);

        // The following expect() is also redundant with the 1st toHaveTest() above, but (again) is included for demonstration purposes
        const option = await optionList.nth(i).textContent();  // This gets "Light", "Dark", etc.
        expect(option.trim()).toEqual(colors_keys[i]);  

        await optionList.nth(i).click(); // Select the i-th option from the dropdown menu
        await expect(header).toHaveCSS('background-color', colors[colors_keys[i]]); // Verify that the color has changed

        await page.waitForTimeout(1000); // Wait for 1 second to allow the option selected and its corresponding color to be seen
    }
})
