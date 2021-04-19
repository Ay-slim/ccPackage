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
    return String(Math.floor(Math.random() * (10**size)))
}

function joinCC(firstPart, bodyLength){
    const allButLuhn = firstPart + generateRandomNumbers(bodyLength)
    const lastDigit = calculateLuhn(allButLuhn)
    return allButLuhn + lastDigit
}

function fullCCNumber(options) {

    const bank_code = options.bank_code || null
    const starts_with = options.starts_with || null
    const ends_with = options.ends_with || null
    const contains = options.contains || null
    const issuer = options.issuer || null

    if(bank_code && !bank_bins.hasOwnProperty(bank_code)) {
        throw new Error("Invalid bank code or not available currently")
    }

    const userDefinedNumbersPassed = starts_with || ends_with || contains
    const longerThanTenDigits = (starts_with && starts_with.length > 10) || (ends_with && ends_with.length > 10) || (contains && contains.length > 10)
    if (longerThanTenDigits) {
        throw new Error("You cannot specify more than ten digits")
    }

    if(bank_code && bank_bins.hasOwnProperty(bank_code)){
        const bankBin = String(bank_bins[bank_code].bin)
        const midLength = 15 - bankBin.length
        return joinCC(bankBin, midLength)
    }

    if(issuer && issuer === 'Verve' && !userDefinedNumbersPassed) {
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
}

console.log(fullCCNumber({ starts_with: '49059', issuer: 'Verve' }))

module.exports = fullCCNumber