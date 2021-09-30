---
sidebar_position: 3
---

# Finalize parameters

Now you can return to the Reality Module interface and enter your `TemplateId`, as well as make sure the `Oracle Address` matches the `Reality Instance` address from the template builder. Here we'll enter ours from the example, 31.

![Reality Module Parameters](/img/tutorial/reality_7.jpg)

You'll want to set each of the remaining Parameters to custom amounts. Some notes on what each field means and its importance:

- `Timeout`: Duration that answers can be submitted to the oracle (resets when a new answer is submitted)
- `Cooldown`: Duration required before the transaction can be executed (after the timeout has expired).
- `Expiration`: Duration that a transaction is valid in seconds (or 0 if valid forever) after the cooldown (note this applies to all proposals on this module).
- `Bond`: Minimum bond required for an answer to be accepted. New answers must be submitted with double the previous bond. For more on why a bond is required in an escalation-game-based oracle, read more in the [Reality.eth whitepaper](http://reality.eth.link/app/docs/html/whitepaper.html).

Here we've entered smaller amounts for the purpose of the tutorial. These Parameters are very important for your DAO's security and should be considered carefully. We'll return to security practices at the end of this tutorial.

Here's an example of how those different fields interact during a question's resolution:

1. An answer is submitted to the Oracle, the `Timeout` timer begins.
2. If no other answer is submitted before the `Timeout` timer reaches 0, the current answer is finalized as correct.
3. The `Cooldown` timer begins.
4. When the `Cooldown` timer reaches 0, the `Expiration` timer starts. At this point, the transaction can be triggered (through the Reality.eth UI or contract) and will succeed unless the `Expiration` timer has reached 0.

## Add module

When satifised with the Parameters you've entered, click the `Add Module` button.

## Submit transaction

After that, you should see a Gnosis Safe modal prompting you to review the transaction. Click `Submit` when ready:

![Submit](/img/tutorial/reality_submit.jpg)

Confirm the transaction with your web3 wallet that is a signer on the Gnosis Safe.
