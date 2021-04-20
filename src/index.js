//to do: add validator with joi, strings for all of them, Visa, Master, Verve for issuer
// consider adding visa bins for individual banks
const bank_bins = require('./bank_codes.json')

const {
    calculateLuhn,
    generateRandomNumbers,
    iterateForEndsWith,
    joinCC
} = require('./helpers')

function fullCCNumber(options) {

    const bank_code = options.bank_code || null
    const starts_with = options.starts_with || null
    const ends_with = options.ends_with || null
    const contains = options.contains || null
    const issuer = options.issuer || null

    if(bank_code && !bank_bins.hasOwnProperty(bank_code)) {
        throw new Error("Invalid bank code or bank not available currently")
    }

    const userDefinedNumbersPassed = starts_with || ends_with || contains
    const longerThanTenDigits = (starts_with && starts_with.length > 10) || (ends_with && ends_with.length > 10) || (contains && contains.length > 10)
    if (longerThanTenDigits) {
        throw new Error("You cannot specify more than ten digits")
    }

    if(bank_code && bank_bins.hasOwnProperty(bank_code) && !userDefinedNumbersPassed && !issuer){
        const bankBin = String(bank_bins[bank_code].bin)
        const midLength = 15 - bankBin.length
        return joinCC(bankBin, midLength)
    }

    if(issuer && issuer === 'Verve' && !userDefinedNumbersPassed && !bank_code) {
        return joinCC('5', 17)
    }

    if(issuer && issuer === 'MasterCard' && !userDefinedNumbersPassed && !bank_code) {
        return joinCC('5', 14)
    }

    if(issuer && issuer === 'Visa' && !userDefinedNumbersPassed && !bank_code) {
        return joinCC('4', 14)
    }

    if(starts_with && (!issuer || (issuer && (issuer === 'Visa' || issuer === 'MasterCard'))) && !bank_code) {
        const midLength = 15 - starts_with.length
        return joinCC(starts_with, midLength)
    }

    if(starts_with && (issuer && issuer === 'Verve') && !bank_code) {
        const midLength = 18 - starts_with.length
        return joinCC(starts_with, midLength)
    }

    if(contains && !issuer && !bank_code && !starts_with && !ends_with) {
        const firstNumbers = '5' + contains
        const midLength = 14 - contains.length
        return joinCC(firstNumbers, midLength)
    }
    
    if(contains && bank_code){
        if(contains.length > 9) throw new Error("you can't specify more than 9 digits with a bank code")
        if(contains.length === 9){
            const bankBin = String(bank_bins[bank_code].bin)
            const allButLuhn = bankBin + contains
            const lastDigit = calculateLuhn(allButLuhn)
            return allButLuhn + lastDigit
        }
        const bankBin = String(bank_bins[bank_code].bin)
        const firstNumbers = bankBin + contains
        const midLength = 16 - (bankBin.length + contains.length + 1)
        return joinCC(firstNumbers, midLength)
    }

    if(contains && issuer && !bank_code) {
        const firstNumbers = issuer === 'Visa' ? '4' + contains : '5' + contains
        const midLength = issuer === 'Verve' ? 19 - (firstNumbers.length + 1) : 16 - (firstNumbers.length + 1)
        return joinCC(firstNumbers, midLength)
    }

    if(ends_with && !issuer && !bank_code && !starts_with && !contains) {
        
        const midNumbers = generateRandomNumbers(16 - (ends_with.length + 1))
        let initialGuess = '5' + midNumbers + ends_with
        return iterateForEndsWith(initialGuess)
    }

    if(ends_with && issuer && !bank_code && !starts_with && !contains) {
        const midLength = issuer === 'Verve' ? 19 - (ends_with.length + 1) : 16 - (ends_with.length + 1)
        const midNumbers = generateRandomNumbers(midLength)
        let initialGuess = issuer === 'Visa' ? '4' + midNumbers + ends_with : '5' + midNumbers + ends_with
        return iterateForEndsWith(initialGuess)
    }

    if(ends_with && bank_code && !issuer && !starts_with && !contains) {
        if(ends_with.length > 9) throw new Error("you can't specify more than 9 digits with a bank code")

        const bankBin = String(bank_bins[bank_code].bin)
        const midLength = 16 - (bankBin.length + ends_with.length)
        const midNumbers = generateRandomNumbers(midLength)
        let initialGuess = bankBin + midNumbers + ends_with
        return iterateForEndsWith(initialGuess, true)
    }
}

const testResult = fullCCNumber({ bank_code: '014' })
console.log(testResult, testResult.length)

module.exports = fullCCNumber