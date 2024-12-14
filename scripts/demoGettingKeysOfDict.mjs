// demoGettingKeysOfDict.mjs {by Russell Johnson}
//    • To run this script:
//          1. Open a Terminal (for which node.js is installed)
//          2. "cd" (Change directory) into the folder containing this script
//          3. Type "node demoGettingKeysOfDict.mjs" and hit the <Enter> key
//    • The ".mjs" extension is needed because with just a ".js" or ".ts" file you'll be warned that you
//      "Cannot use import statement outside a module"
//      See https://stackoverflow.com/questions/63588714/node-warning-to-load-an-es-module-set-type-module-how-to-fix

/**
 * This function demonstrates how to retrieve the keys of a JavaScript object (dictionary).
 * It uses the Object.keys() method to get an array of the keys from the 'colors' object.
 * The keys are then logged to the console.
 *
 * @function demoGettingKeysOfDict
 * @returns {void} - The function does not return a value. It logs the keys to the console.
 */
function demoGettingKeysOfDict() {
    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    };

    // Log the keys of the 'colors' object to the console
    console.log(Object.keys(colors));
}


demoGettingKeysOfDict()
