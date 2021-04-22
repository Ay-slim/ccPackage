# card-number-generator
card-number-generator lets you generate valid credit or debit card numbers that pass the Luhn algorithm test. You can specify features of the credit card number including the issuer(MasterCard, Visa, Verve), bank, or not more than 10 digits which the credit card number must contain, start with, or end with. 

# Installation
`npm install card-number-generator`

# Usage
The package accepts input as a javascript object specifying the details of the card number you wish to generate. For example, below is the code for generating a Master Card number:

`const cardGen = require('card-number-generator')`

`cardGen({issuer: 'MasterCard'})` _#returns a valid 16 digit mastercard number starting with 5(e.g. 5939403084030308)_

## Important notes
- All arguments should be passed as strings.
- Only MasterCard, Visa, and Verve are the supported issuers for now. Others will be added soon in an upcoming version.
- Supported banks and their codes are listed in the bank_codes section.

Below are the various arguments you can pass to the package and their possible combinations:

## Issuer
This is the card type for which you wish to generate a card number. Currently, only three card types are supported: Visa, MasterCard, and Verve.
- Examples:

`const cardGen = require('card-number-generator')`

`cardGen({issuer: 'Visa'})` _#returns a valid 16 digit Visa card number starting with 4(e.g. 4939403084030308)_

`const cardGen = require('card-number-generator')`

`cardGen({issuer: 'Verve'})` _#returns a valid 19 digit mastercard number starting with 5(e.g. 5939403084030308291)_

## bank_code
Here you can specify which bank you want the card generated from with pre-determined bank_code numbers shown after the examples.
- Examples:

The line below generates a card number from Access bank, Nigeria

`const cardGen = require('card-number-generator')`

`cardGen({bank_code: '044'})` _#returns a valid 16 digit card number from Access bank starting with the bin 403660(e.g. 4036603922028372)_

Eco bank Nigeria

`const cardGen = require('card-number-generator')`

`cardGen({bank_code: '050'})` _#returns a valid 16 digit card number from Eco bank starting with the bin 558773(e.g. 5587733922028372)_

National Bank of Kenya, Ltd.

`const cardGen = require('card-number-generator')`

`cardGen({bank_code: '12'})` _#returns a valid 16 digit card number from National bank of Kenya starting with the bin 477949(e.g. 4779493922028372)_

- This json lists the currently supported banks and their corresponding codes:

```

{
 ACCESS BANK PLC: '044',
 AFRIBANK NIGERIA PLC: '014',
 BANK OF AFRICA (KENYA), LTD: '07',
 BARCLAYS BANK OF GHANA, LTD: '20313500',
 BARCLAYS BANK OF UGANDA, LTD: '20654200',
 BARCLAYS BANK OF ZIMBABWE LIMITED: 'ZM020000',
 BARCLAYS BANK OF ZIMBABWE, LTD: 'ZM020000',
 CITIBANK NA KENYA: '16',
 CO-OPERATIVE BANK OF KENYA, LTD: '11',
 CRANE BANK, LTD: '27541792',
 Chase Bank Limited: '31',
 Consolidated Bank of Kenya Limited: '23',
 DIAMOND BANK, LTD: '063',
 DIAMOND TRUST BANK KENYA, LTD: '63',
 ECOBANK GHANA, LTD: 'GH130100',
 ECOBANK NIGERIA PLC: '050',
 ECOBANK RWANDA S.A: 'RW100000',
 EQUITY BANK, LTD: '68',
 FIDELITY COMMERCIAL BANK, LTD: '070',
 FIRST BANK OF NIGERIA PLC: '011',
 FIRST CITY MONUMENT BANK PLC: '214',
 GHANA COMMERCIAL BANK, LTD: '20313600',
 GUARANTY TRUST BANK(NIGERIA): '058',
 GUARANTY TRUST BANK GHANA, LTD: '25562284',
 HERITAGE BANK: '030',
 IMPERIAL BANK, LTD: '39',
 KENYA COMMERCIAL BANK LTD. (KCB): '01',
 KEYSTONE BANK PLC: '082',
 Middle East Bank Kenya Limited: '18',
 NATIONAL BANK OF KENYA, LTD: '12',
 NATIONAL INDUSTRIAL CREDIT BANK, LTD: '41',
 Oriental Commercial Bank Limited: '14',
 Providus Bank: '101',
 SKYE BANK PLC: '076',
 STANBIC BANK GHANA, LTD: '97151844',
 STANBIC BANK UGANDA, LTD: '20654600',
 STANBIC BANK ZIMBABWE, LTD: 'ZM040000',
 STANBIC IBTC BANK: '221',
 STANDARD CHARTERED BANK': '20654700',
 STANDARD CHARTERED BANK GHANA, LTD: '20314200',
 STANDARD CHARTERED BANK NIGERIA, LTD: '068',
 STANDARD CHARTERED BANK ZIMBABWE, LTD: 'ZM060000',
 STERLING BANK PLC: '232',
 Trans-National Bank Limited: '26',
 UNION BANK OF NIGERIA PLC: '032',
 UNITED BANK FOR AFRICA GHANA, LTD: '2006228LG0',
 UNITED BANK FOR AFRICA PLC(NIGERIA): '033',
 UNITY BANK PLC: '215',
 WEMA BANK PLC: '035',
 ZENITH BANK: '057'
 }

```

## starts_with
Specify up to ten digits that the generated card number must begin with (passing more than ten digits will throw an error)
- example:

`const cardGen = require('card-number-generator')`

`cardGen({starts_with: '4672134563'})` _#returns a valid 16 digit card number starting with the bin 4672134563(e.g. 4672134563028372)_

## contains
Specify up to ten digits that the generated card number must contain (passing more than ten digits will throw an error)
- example:

`const cardGen = require('card-number-generator')`

`cardGen({contains: '4672134'})` _#returns a valid 16 digit card number containing the bin 4672134(e.g. 5646721348378532)_

## ends_with
Specify up to ten digits that the generated card number must end with (passing more than ten digits will throw an error)
- example:

`const cardGen = require('card-number-generator')`

`cardGen({ends_with: '92134'})` _#returns a valid 16 digit card number ending with the bin 4672134(e.g. 5646721348378532)_

## combinations
You can combine more than one condition e.g.

## bank_code and ends_with (or contains)
Generate a card number from a specific bank that contains up to 9 digits (passing more than 9 digits to contains or ends_with for this combination will throw an error)

- examples: 

A card number from Access bank that ends with 92134
`const cardGen = require('card-number-generator')`

`cardGen({bank_code: '044, ends_with: '92134'})` _#returns a valid 16 digit card number ending with the bin 92134(e.g. 4036601348392134)_

A card number from Access bank that contains 92134
`const cardGen = require('card-number-generator')`

`cardGen({bank_code: '044, contains: '92134'})` _#returns a valid 16 digit card number ending with the bin 92134(e.g. 4036609213413483)_

## issuer and ends_with (or contains)
Generate a card number from a given issuer containing or ending with up to 9 digits (passing more than 9 digits to contains or ends_with for this combination will throw an error)

A Verve card number that ends with 92134:

`const cardGen = require('card-number-generator')`

`cardGen({issuer: 'Verve', ends_with: '92134'})` _#returns a valid 16 digit card number ending with the bin 92134(e.g. 5036639401348392134)_

A Visa card number that ends with 92134:

`const cardGen = require('card-number-generator')`

`cardGen({issuer: 'Visa', ends_with: '92134'})` _#returns a valid 16 digit card number ending with the bin 92134(e.g. 4036609213192134)_

A MasterCard number that contains 92134:

`const cardGen = require('card-number-generator')`

`cardGen({issuer: 'Visa', ends_with: '92134'})` _#returns a valid 16 digit card number ending with the bin 92134(e.g. 5131921340366092)_

## bank_code and issuer
Not supported yet, will come up in a future version