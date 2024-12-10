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
})