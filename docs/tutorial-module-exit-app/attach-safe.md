---
sidebar_position: 2
---

# Attach Safe and wallet

When you open the Exit App, it will look like this:

![Exit App interface](/img/tutorial/exitapp_01-attach-safe.png)

The Exit App prompts you to enter an <code>Account Address</code>. The address refers to the Exit-enabled Safe account from which you are exiting.

Enter the Safe's address into the <code>Account Address</code> field, and click "Attach Account". 

If the Safe is on a network other than Mainnet, you can either select the correct network from the dropdown menu at the top or preface the address with its chain ID. For example, a Safe on Rinkeby could also be entered as <code>rin:0xF44…dbd4</code>, which will automatically switch the dropdown to the correct network.

Be sure to verify the Account Address is correct. If you need to find the Account Address of the Safe that holds the assets you wish to claim, inquire with the account admins, find an official resource, or look up the Safe on a block explorer like https://etherscan.io.

Note: You will receive the following error if the Safe does not have the Exit Module equipped: "The account address entered is not a Safe on [current network]. Please confirm it's correct, or use the dropdown above to attach a Safe deployed on a different network."

## Connect Web3 wallet

Next, attach your web3 wallet by clicking on "Connect Wallet" in the left panel. If you're exiting while using a Safe account, you do not need this step, because you are already connected via the Safe App.

![Connect wallet](/img/tutorial/exitapp_02-connect-web3-wallet.png)

In this tutorial, we'll use the ALUM token, a test token on the Rinkeby test network.


