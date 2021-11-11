---
sidebar_position: 4
---

# Deploy To Rinkeby

Navigate to [rinkeby.gnosis-safe.io/app/](https://rinkeby.gnosis-safe.io/app/#/) and create a new Gnosis Safe.

![Gnosis Safe: create](/img/tutorial/build_module_07.png)

Head back to Remix and change your provider to "injected web3" to connect to metamask. Make sure you metamask is connected to Rinkeby.

![Remix: change providers](/img/tutorial/build_module_08.png)

Deploy your `Button` contract and make sure to set its owner to your newly created safe's address.

Deploy your `MyModule`, using your newly created safe's address for the `_owner` parameter and your newly deployed Button contract's address for the `_button` parameter.

In the Gnosis Safe app, navigate to the "apps" tab and select the Zodiac Safe App.

![Gnosis Safe: Zodiac App](/img/tutorial/build_module_09.png)

Select "custom module", enter the address of your newly deployed module, and hit "Add Module".

![Zodiac App: custom module](/img/tutorial/build_module_10.png)

Once the transaction confirms, you should see your new module show up in your list of enabled modules.

Back in remix, try pushing the button in your `MyModule` contract.

Once that transaction has confirmed, you should see a new "contract interaction" item in your safe's transaction history.

![Gnosis Safe: Transaction History](/img/tutorial/build_module_11.png)

Congratulations!

You've successfully built a Zodiac module, deployed it to a public test network, and controlled a Gnosis Safe with it.
