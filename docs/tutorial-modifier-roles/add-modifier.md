---
sidebar_position: 2
---

# Add Modifier

Next you should click on the Roles Modifier available through the Zodiac App on Gnosis Safe. When you open the Roles Modifier, it will look like this:

----
*Image of Roles Modifier Deployment*

Now, you should fill in the fields:

- **Owner Address**: Address that can call functions
- **Avatar Address**: Address of the DAO (e.g. a Gnosis Safe).
*Note: This is usually the same as the owner address.*
- **Target Address**: Address on which the module will call `execModuleTransaction()`. This is the contract that executes the transactions.

For this tutorial, we've chosen short time periods.

Once you've entered the Cooldown and Expiration parameters, click the Add Module button.

# Submit transaction
After that, you should see a Gnosis Safe modal prompting you to review the transaction. Click Submit when ready:

----
*Image of Roles Modifier Transaction Submission*

Confirm the transaction with your web3 wallet that is a signer on the Gnosis Safe.