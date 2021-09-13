---
sidebar_position: 2
---

# Finalize parameters

Next you should click on the Bridge Module available through the Zodiac App on Gnosis Safe. When you open the Bridge Module, it will look like this:

![Add Bridge Module](/img/tutorial/bridge_1.png)

Now, you should fill in the Parameters.

The first parameter, `AMB Contract Address` refers to the contract address for the Arbitrary Message Bridge for the chains you would like to send transactions across (e.g. Rinekby-xDai).

The second parameter, `Controller Contract Address` refers to the contract address for the avatar (account) which you would like to control on another chain.

Finally, the `Chain Id` refers to the id of the chain network on which you would like to control another contract.

Let's take an example:

![Finalize Parameters](/img/tutorial/bridge_2.png)

We would like our Gnosis Safe on Rinkeby to control a Gnosis Safe on the xDai network. So we've entered:

* `AMB Contract Address`: 0xD4075FB57fCf038bFc702c915Ef9592534bED5c1 (Address of the Rinkeby-xDai network AMB)
* `Controller Contract Address`: 0xFF50a6...D2 (Address of our Gnosis Safe on the xDai network)
* `Chain Id`: 100 (Chain id of the xDai network) 

## Add module

When satifised with the Parameters you've entered, click the `Add Module` button.

## Submit transaction

After that, you should see a Gnosis Safe modal prompting you to review the transaction. Click `Submit` when ready:

![Submit](/img/tutorial/bridge_3.png)

Confirm the transaction with your web3 wallet that is a signer on the Gnosis Safe.