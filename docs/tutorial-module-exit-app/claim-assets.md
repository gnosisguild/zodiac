---
sidebar_position: 4
---

# Claim assets

## Initiate transaction

Verify that the transaction details (the Exit Token and Amount, the claimable asset[s], and the Claimable Value) are correct 

Click on "Exit and Claim Assets".

The Exit App will ask you to "Approve token expense". 

If you’re using an web3 wallet, confirm when your wallet prompts you to give access to the redeeming token in your wallet.

The screenshot below is an example using the ALUM token and MetaMask.

![Initiate transaction](/img/tutorial/exitapp_05-initiate.png)

You must now wait for the approval transaction to be executed.

Note: If you’re exiting while using a Safe, the confirmation of the approval transaction and the following Exit Transaction are batched together.


## Execute Exit Transaction

Once the approval transaction has completed, the actual Exit Transaction will then be triggered automatically. The status on the transaction button will now say "Exiting…" To finally execute the Exit Transaction, choose <code>Confirm</code> when your web3 wallet prompts you again.

![Initiate transaction](/img/tutorial/exitapp_06-execute.png)

## Verify transaction

Once the transaction has completed, the transaction button in the Exit App will now say "Exit Successful".

The Exit App will update the values of both your balance and the attached Safe account's treasury. 

![Exit Sucessful confirmation](/img/tutorial/exitapp_07-successful.png)
