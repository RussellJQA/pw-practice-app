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

    // My somewhat cleaner implementation
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

// My somewhat cleaner implementation
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
        await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);
        await optionList.filter({hasText: color}).click();
        await expect(header).toHaveCSS('background-color', colors[color]);
    }
})
