---
sidebar_position: 5
---

# Integrate Snapshot

Once the module is set up, it is possible to integrate a space on [Snapshot](https://snapshot.org/) with the Reality Module plugin. For this, the space configuration needs to include `"plugins": { "daoModule": { "address": "<module_address>"} }`. The Reality Module address can be found at the top of its interface on Gnosis Safe:

![Configured Reality Module](/img/tutorial/reality_8.png)

An example of this can be found in the [🍯DAO space configuration](https://cloudflare-ipfs.com/ipfs/QmahDCSkdED9BLZ3VtH6aJ8P5TmvMYEfA7fJa4hGsvEpi2/).

Once your space is configured, you can attach transactions to proposals using the Snapshot plugin section.

## Open the Snapshot plugin section

![Open the Snapshot plugin section](https://github.com/gnosis/zodiac-module-reality/raw/features-readme/docs/snapshot_plugin_section.png)

## Add Reality Module (formerly DAO module) plugin

![Add Reality Module (formerly DAO Module) plugin](https://github.com/gnosis/zodiac-module-reality/raw/features-readme/docs/snapshot_add_plugin.png)

## Add Reality Module (formerly DAO module) transaction

<img src="https://github.com/gnosis/zodiac-module-reality/raw/features-readme/docs/snapshot_module_add_tx.png"
     alt="Add DAO module transaction"
     width="250"/>
<img src="https://github.com/gnosis/zodiac-module-reality/raw/features-readme/docs/snapshot_module_tx_details.png"
     alt="Enter transactiond etails"
     width="250" />
<img src="https://github.com/gnosis/zodiac-module-reality/raw/features-readme/docs/snapshot_module_tx_confirm.png"
     alt="Check transaction details"
     width="250"/>

## Review preview of transactions

![Transactions preview](https://github.com/gnosis/zodiac-module-reality/raw/features-readme/docs/snapshot_plugin_preview.png)

Once the proposal has been resolved, it can be submitted to the Reality Module via the Snapshot plugin. 

Once the question is available to the oracle, it can be answered via the Reality.eth web interface: https://reality.eth.link/app/.
