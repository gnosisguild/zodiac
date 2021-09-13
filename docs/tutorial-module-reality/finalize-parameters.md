---
sidebar_position: 3
---

# Finalize parameters

Now you can return to the Reality Module interface and enter your `TemplateId`. Here we'll enter ours from the example, 31.

![Reality Module Parameters](/img/tutorial/reality_4.png)

You'll want to set each of the remaining Parameters to custom amounts. Some notes on what each field means and its importance: 

* `Timeout`: Duration that answers can be submitted to the oracle.
* `Cooldown`: Duration required before the transaction can be executed (after the timeout has expired). 
* `Expiration`: Duration that a transaction is valid in seconds (or 0 if valid forever) after the cooldown.
* `Bond`: Minimum bond required for an answer to be accepted. For more on why a bond is required in an escalation-game-based oracle, read more in the [Reality.eth whitepaper](http://reality.eth.link/app/docs/html/whitepaper.html).

Here we've entered smaller amounts for the purpose of the tutorial. These Parameters are very important for your DAO's security and should be considered carefully. We'll return to security practices at the end of this tutorial.

## Add module

When satifised with the Parameters you've entered, click the `Add Module` button.

## Submit transaction

After that, you should see a Gnosis Safe modal prompting you to review the transaction. Click `Submit` when ready:

![Submit](/img/tutorial/reality_5.png)

Confirm the transaction with your web3 wallet that is a signer on the Gnosis Safe.