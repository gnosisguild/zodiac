---
sidebar_position: 5
---

# Integrate Snapshot

Once the module is set up, it is possible to integrate a space on [Snapshot](https://snapshot.org/) with the Reality Module plugin.

To accomplish this you can set it up through the Snapshot Space settings, or by setting the space's configuration JSON directly. Both methods require the address of the Reality Module, which can be found at the top of its interface on Gnosis Safe:

![Configured Reality Module](/img/tutorial/reality_review_3.jpg)

To set the JSON directly, the space configuration needs to include `"plugins": {"safeSnap": {"safes": [{"network": "CHAIN_ID","realityAddress": "0xSWITCH_WITH_REALITY_MODULE_ADDRESS"}]}}`.

More information and an example of this can be found here [Snapshot documentation.](https://docs.snapshot.org/spaces/alternative-way-to-create-a-space).

Note that your plugins field should look similar to this:

```
"plugins": {
    "safeSnap": {
      "safes": [
        {
          "network": "CHAIN_ID",
          "realityAddress": "0xSWITCH_WITH_REALITY_MODULE_ADDRESS"
        }
      ]
  }
},
```

## To setup SafeSnap using the UI:

### 1. Open the Snapshot Settings page

The settings to your Snapshot page live at a link similar to this one: https://snapshot.org/#/org_name/settings, where "org_name" should be switched with your group's name.

Scroll down to the bottom of the page, where the plugin settings are.

![Snapshot settings page](/img/tutorial/safesnap_1.jpg)

### 2. Add the Safesnap plugin

Click on the Safesnap plugin:
![Snapshot plugin popup](/img/tutorial/safesnap_2.jpg)

Enter in the following JSON, with your Reality module address substituted.

```
{
  "address": "0xSWITCH_WITH_REALITY_MODULE_ADDRESS"
}
```

It should look similar to this:
![Setting up the Safesnap plugin](/img/tutorial/safesnap_3.jpg)

## Using the Safesnap plugin

### Add transactions to a proposal

If configured correctly, a "Transactions" container will show below the "Choices" container when creating a new proposal.
![The transactions container](/img/tutorial/safesnap_4.jpg)

### Kicking off the Reality Oracle

Once a vote closes on Snapshot, you will be able to 'Request Execution" in the "Safesnap Transactions" window.
![The Reality Oracle initial state](/img/tutorial/safesnap_5.jpg)

### Setting an outcome

Once the Oracle has been initialized, an initial outcome must be set. The person setting this outcome must offer a Bond, that can be claimed by them later if their answer is selected (this Bond value is set in an earlier step).
![Changing the outcome of the vote](/img/tutorial/safesnap_6.jpg)
![Selecting the outcome popup](/img/tutorial/safesnap_7.jpg)

### Waiting for an outcome to finalize

Once an outcome has been set, the Safesnap window will show how long until that vote is finalized (this is the `Timeout` value we set in an earlier step).
![The outcome finalizing timer](/img/tutorial/safesnap_8.jpg)

### Outcome cooldown period

Once the outcome is finalized, the Safesnap plugin will enter it's `Cooldown` period, the waiting period after an outcome is finalized and before the transaction can be executed (we set the `Cooldown` duration in an earlier step).
![Showing the cooldown timer](/img/tutorial/safesnap_9.jpg)

### Executing the transactions

After the cooldown period, the transaction will be executable, and the bond put up to finalize the outcome can be claimed.
![The transaction is ready to execute](/img/tutorial/safesnap_10.jpg)
