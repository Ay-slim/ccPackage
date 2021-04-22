const {expect, assert} = require('chai')
const generateCC = require('./index')
const { calculateLuhn } = require('./helpers')
const { MASTER_VISA_LENGTH, VERVE_LENGTH } = require('./constants')
const bankBins = require('./bank_codes.json')
suite('All tests', function() {

    test('Bank code only', function() {
        const ccNumber = generateCC({ bank_code: '014' })
        assert.equal(ccNumber.length, MASTER_VISA_LENGTH)
        const lastIndex = ccNumber.length - 1
        assert.equal(calculateLuhn(ccNumber.slice(0, lastIndex)), ccNumber[lastIndex])
    })

    test('Throws error for number longer than ten', function(){
        expect(() => generateCC({contains: '9399392292929202'}).to.throw("You cannot specify more than ten digits"))
    })

    test('Throws error for unavailable bank code', function(){
        expect(() => generateCC({bank_code: '402383832122'}).to.throw("Invalid bank code or bank not available currently"))
    })

    test('Only issuer, MasterCard', function() {
        const ccNumber = generateCC({ issuer: 'MasterCard' })
        assert.equal(ccNumber.length, MASTER_VISA_LENGTH)
        assert.equal(ccNumber[0], '5')
        const lastIndex = ccNumber.length - 1
        assert.equal(calculateLuhn(ccNumber.slice(0, lastIndex)), ccNumber[lastIndex])
    })

    test('Only issuer, Verve', function() {
        const ccNumber = generateCC({ issuer: 'Verve' })
        assert.equal(ccNumber.length, VERVE_LENGTH)
        assert.equal(ccNumber[0], '5')
        const lastIndex = ccNumber.length - 1
        assert.equal(calculateLuhn(ccNumber.slice(0, lastIndex)), ccNumber[lastIndex])
    })

    test('Only issuer, Visa', function() {
        const ccNumber = generateCC({ issuer: 'Visa' })
        assert.equal(ccNumber.length, MASTER_VISA_LENGTH)
        assert.equal(ccNumber[0], '4')
        const lastIndex = ccNumber.length - 1
        assert.equal(calculateLuhn(ccNumber.slice(0, lastIndex)), ccNumber[lastIndex])
    })

    test('Only contains', function() {
        const TEST_CONTAINS = '3728302543'
        const ccNumber = generateCC({ contains: TEST_CONTAINS })
        assert.equal(ccNumber.length, MASTER_VISA_LENGTH)
        assert.equal(ccNumber.slice(1, TEST_CONTAINS.length+1), TEST_CONTAINS)
        const lastIndex = ccNumber.length - 1
        assert.equal(calculateLuhn(ccNumber.slice(0, lastIndex)), ccNumber[lastIndex])
    })

    test('Contains and bank_code', function() {
        const TEST_CONTAINS = '37283023'
        const ccNumber = generateCC({ contains: TEST_CONTAINS, bank_code: '014' })
        assert.equal(ccNumber.length, MASTER_VISA_LENGTH)
        assert.include(ccNumber, TEST_CONTAINS)
        assert.include(ccNumber, bankBins['014'].bin)
        const lastIndex = ccNumber.length - 1
        assert.equal(calculateLuhn(ccNumber.slice(0, lastIndex)), ccNumber[lastIndex])
    })

    test('Contains and Verve', function() {
        const TEST_CONTAINS = '37283023'
        const ccNumber = generateCC({ contains: TEST_CONTAINS, issuer: 'Verve' })
        assert.equal(ccNumber.length, VERVE_LENGTH)
        assert.include(ccNumber, TEST_CONTAINS)
        const lastIndex = ccNumber.length - 1
        assert.equal(calculateLuhn(ccNumber.slice(0, lastIndex)), ccNumber[lastIndex])
    })

    test('Throws error for contains and bank_code > 9 digits', function(){
        expect(() => generateCC({contains: '9399392292', bank_code: '014'}).to.throw("you can't specify more than 9 digits in addition to a bank code"))
    })

    test('Starts with', function() {
        const TEST_STARTS = '57283023'
        const ccNumber = generateCC({ starts_with: TEST_STARTS })
        assert.equal(ccNumber.length, MASTER_VISA_LENGTH)
        assert.equal(ccNumber.slice(0, TEST_STARTS.length), TEST_STARTS)
        const lastIndex = ccNumber.length - 1
        assert.equal(calculateLuhn(ccNumber.slice(0, lastIndex)), ccNumber[lastIndex])
    })
    
    test('Starts with and verve', function() {
        const TEST_STARTS = '57283023'
        const ccNumber = generateCC({ starts_with: TEST_STARTS, issuer: 'Verve' })
        assert.equal(ccNumber.length, VERVE_LENGTH)
        assert.equal(ccNumber.slice(0, TEST_STARTS.length), TEST_STARTS)
        const lastIndex = ccNumber.length - 1
        assert.equal(calculateLuhn(ccNumber.slice(0, lastIndex)), ccNumber[lastIndex])
    })

    test('Ends_with alone', function() {
        const TEST_ENDS = '57283023'
        const ccNumber = generateCC({ ends_with: TEST_ENDS })
        assert.equal(ccNumber.length, MASTER_VISA_LENGTH)
        assert.equal(ccNumber.slice(ccNumber.length-TEST_ENDS.length, ccNumber.length), TEST_ENDS)
        const lastIndex = ccNumber.length - 1
        assert.equal(calculateLuhn(ccNumber.slice(0, lastIndex)), ccNumber[lastIndex])
    })

    test('Ends with and Visa', function() {
        const TEST_ENDS = '83937429'
        const ccNumber = generateCC({ ends_with: TEST_ENDS, issuer: 'Visa'})
        assert.equal(ccNumber.length, MASTER_VISA_LENGTH)
        assert.equal(ccNumber[0], '4')
        assert.equal(ccNumber.slice(ccNumber.length-TEST_ENDS.length, ccNumber.length), TEST_ENDS)
        const lastIndex = ccNumber.length - 1
        assert.equal(calculateLuhn(ccNumber.slice(0, lastIndex)), ccNumber[lastIndex])
    })

    test('Ends with and Verve', function() {
        const TEST_ENDS = '83937429'
        const ccNumber = generateCC({ ends_with: TEST_ENDS, issuer: 'Verve'})
        assert.equal(ccNumber.length, VERVE_LENGTH)
        assert.equal(ccNumber[0], '5')
        assert.equal(ccNumber.slice(ccNumber.length-TEST_ENDS.length, ccNumber.length), TEST_ENDS)
        const lastIndex = ccNumber.length - 1
        assert.equal(calculateLuhn(ccNumber.slice(0, lastIndex)), ccNumber[lastIndex])
    })

    test('Ends with and bank_code', function() {
        const TEST_ENDS = '83937429'
        const ccNumber = generateCC({ ends_with: TEST_ENDS, bank_code: '011'})
        assert.equal(ccNumber.length, MASTER_VISA_LENGTH)
        assert.include(ccNumber, bankBins['011'].bin)
        assert.equal(ccNumber.slice(ccNumber.length-TEST_ENDS.length, ccNumber.length), TEST_ENDS)
        const lastIndex = ccNumber.length - 1
        assert.equal(calculateLuhn(ccNumber.slice(0, lastIndex)), ccNumber[lastIndex])
    })
})