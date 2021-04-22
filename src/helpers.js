//to do: add validator with joi, strings for all of them, Visa, Master, Verve for issuer
// consider adding visa bins for individual banks
const bank_bins = require('./bank_codes.json')

function calculateLuhn(otherNumbers) {
    const presentLength = otherNumbers.length
    const remainder = presentLength % 2
    let total = 0
    for (let j = presentLength - 1; j >= 0; j--) {
        let eachDigit = Number(otherNumbers.charAt(j))
        if (j % 2 == remainder) { eachDigit *= 2 }
        if (eachDigit > 9) { eachDigit -= 9 }
        total += eachDigit
    }
    const luhnSum = total % 10
    return String(luhnSum)
}

function generateRandomNumbers(size) {
    return String(Math.floor((Math.random() * (1 - 0.1) + 0.1) * (10**size)))
}

function iterateForEndsWith(firstGuess, withBank=false) {
    const NUMBER_TO_VARY = withBank ? 6 : 2
    let accurateVariable
    for (let j = 0; j<=9; j++) {
        let guessValues = firstGuess.slice(0,NUMBER_TO_VARY) + String(j) + firstGuess.slice(NUMBER_TO_VARY+1, firstGuess.length-1)
        if (calculateLuhn(guessValues) === firstGuess[firstGuess.length-1]) {
            accurateVariable = String(j)
            break
        }
    }
    return firstGuess.slice(0, NUMBER_TO_VARY) + accurateVariable + firstGuess.slice(NUMBER_TO_VARY+1, firstGuess.length)
}

function joinCC(firstPart, bodyLength){
    const allButLuhn = firstPart + generateRandomNumbers(bodyLength)
    const lastDigit = calculateLuhn(allButLuhn)
    return allButLuhn + lastDigit
}

module.exports = {
    calculateLuhn,
    generateRandomNumbers,
    iterateForEndsWith,
    joinCC
}