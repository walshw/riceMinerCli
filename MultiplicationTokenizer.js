/**
 * Takes in a String for a multiplication equation and returns the sum of all numbers
 * @param {String} questionString "12 x 2"
 * @returns {number} 24
 */
function multiply(questionString) {
    const tokens = tokenize(questionString);
    return tokens.length > 0 ? tokens.reduce((total, cur) => total * cur, 1) : 0;
}

/**
 * Turns a String for a multiplication equation into an array of numbers
 * @param {String} questionString "12 x 2"
 * @returns {number[]} [ 12,2 ]
 */
function tokenize(questionString) {
    const numbersToMultiply = [];
    let numberString = '';
    let letter = '';

    for (let i = 0; i < questionString.length; i++) {
        letter = questionString[i];

        if (!isNumber(letter)) {
            if (numberString !== '') {
                numbersToMultiply.push(parseInt(numberString));
            }

            numberString = '';
        } else {
            numberString += letter;

            if (i === questionString.length - 1) {
                numbersToMultiply.push(parseInt(numberString));
            }
        }
    }

    return numbersToMultiply;
}

/**
 * Tells whether or not character is a number
 * @param {String} character "6"
 * @returns {boolean} True
 */
function isNumber(character) {
    const asciiVal = character.charCodeAt(0);
    return asciiVal >= 48 && asciiVal <= 57 ? true : false;
}

export { multiply };
