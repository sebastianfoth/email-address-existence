# About
A library written in Typescript which tries to validate if an email address really exists by connecting to the responsible email server.

# How to install
```npm install @sebastianfoth/email-address-existence --save```

# Usage / Howto
```js
import { EmailAddressExistenceService, EmailValidationStatus } from '@sebastianfoth/email-address-existence';

const service = new EmailAddressExistenceService();
const result = await service.validate({
  recipient: 'MAIL_ADDRESS_TO_CHECK_FOR_EXISTENCE',
  sender: 'YOUR_MAIL_A`DDRESS',
  timeout: 3000,
  portTelnet: 25,
  debug: true,
});

if (result === EmailValidationStatus.MAY_EXISTS) {
  // Yay, the address might exists
}
```

The method validate() returns Promise&lt;EmailValidationStatus&gt;.

## Possible values of EmailValidationStatus
### EmailValidationStatus.NOT_FOUND
The email address wasn't found on the mail server
### EmailValidationStatus.INVALID_SYNTAX
Invalid email address
### EmailValidationStatus.BLOCKED_BY_PROVIDER
Our identification method is blocked by the provider and/or your IP is blacklisted
### EmailValidationStatus.TIMEOUT
Timeout while trying to connect to the email server
### EmailValidationStatus.MAY_EXISTS
The email address might exists

# Caveats
Email providers know how to protect their users, please keep the following things in mind:
* Some email servers might always say that the specific email address exists
* Some email servers might always say that the specific email address doesn't exist
* Some email servers block your IP in case you perform too many queries

Please keep the things mentioned above in mind in case you are using this library. Always try to revalidate the responses by checking addresses you are aware they exist and also do the opposite: Check for addresses which unlikely exist by choosing a random string as username (i.e. jhuihgiuwehiugwh@gmail.com).

# TODOs
* I guess we need a licence
* Documentation
* Extend Options
* General cleanup
* Tests
* Input validation
* Building Process
