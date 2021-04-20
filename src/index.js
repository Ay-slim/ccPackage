//to do: add validator with joi, strings for all of them, Visa, Master, Verve for issuer
// consider adding visa bins for individual banks
const bank_bins = require('./bank_codes.json')

const {
    VERVE_LENGTH,
    MASTER_VISA_LENGTH
} = require('./constants')

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
        const midLength = MASTER_VISA_LENGTH - bankBin.length - 1
        return joinCC(bankBin, midLength)
    }

    if(issuer && !userDefinedNumbersPassed && !bank_code) {
        const leadingDigit = issuer === 'Visa' ? '4' : '5'
        const cardLength = issuer === 'Verve' ? VERVE_LENGTH - 2 : MASTER_VISA_LENGTH - 2
        return joinCC(leadingDigit, cardLength)
    }

    if(starts_with && (!issuer || (issuer && (issuer === 'Visa' || issuer === 'MasterCard'))) && !bank_code) {
        const midLength = MASTER_VISA_LENGTH - starts_with.length - 1
        return joinCC(starts_with, midLength)
    }

    if(starts_with && (issuer && issuer === 'Verve') && !bank_code) {
        const midLength = VERVE_LENGTH - starts_with.length - 1
        return joinCC(starts_with, midLength)
    }

    if(contains && !issuer && !bank_code && !starts_with && !ends_with) {
        const firstNumbers = '5' + contains
        const midLength = MASTER_VISA_LENGTH - contains.length - 2
        return joinCC(firstNumbers, midLength)
    }
    
    if(contains && bank_code && !issuer && !starts_with && !ends_with){
        if(contains.length > 9) throw new Error("you can't specify more than 9 digits in addition to a bank code")

        if(contains.length === 9){
            const bankBin = String(bank_bins[bank_code].bin)
            const allButLuhn = bankBin + contains
            const lastDigit = calculateLuhn(allButLuhn)
            return allButLuhn + lastDigit
        }

        const bankBin = String(bank_bins[bank_code].bin)
        const firstNumbers = bankBin + contains
        const midLength = MASTER_VISA_LENGTH - (bankBin.length + contains.length + 1)
        return joinCC(firstNumbers, midLength)
    }

    if(contains && issuer && !bank_code && !starts_with && !ends_with) {
        const firstNumbers = issuer === 'Visa' ? '4' + contains : '5' + contains
        const midLength = issuer === 'Verve' ? VERVE_LENGTH - (firstNumbers.length + 1) : MASTER_VISA_LENGTH - (firstNumbers.length + 1)
        return joinCC(firstNumbers, midLength)
    }

    if(ends_with && !issuer && !bank_code && !starts_with && !contains) {
        console.log('here')
        const midNumbers = generateRandomNumbers(MASTER_VISA_LENGTH - (ends_with.length + 1))
        let initialGuess = '5' + midNumbers + ends_with
        return iterateForEndsWith(initialGuess)
    }

    if(ends_with && issuer && !bank_code && !starts_with && !contains) {
        const midLength = issuer === 'Verve' ? VERVE_LENGTH - (ends_with.length + 1) : MASTER_VISA_LENGTH - (ends_with.length + 1)
        const midNumbers = generateRandomNumbers(midLength)
        let initialGuess = issuer === 'Visa' ? '4' + midNumbers + ends_with : '5' + midNumbers + ends_with
        return iterateForEndsWith(initialGuess)
    }

    if(ends_with && bank_code && !issuer && !starts_with && !contains) {
        if(ends_with.length > 9) throw new Error("you can't specify more than 9 digits in addition to a bank code")

        const bankBin = String(bank_bins[bank_code].bin)
        const midLength = MASTER_VISA_LENGTH - (bankBin.length + ends_with.length)
        const midNumbers = generateRandomNumbers(midLength)
        let initialGuess = bankBin + midNumbers + ends_with
        return iterateForEndsWith(initialGuess, true)
    }
}

const testResult = fullCCNumber({ ends_with: '85454543', bank_code: '011' })
console.log(testResult, testResult.length)

module.exports = fullCCNumber