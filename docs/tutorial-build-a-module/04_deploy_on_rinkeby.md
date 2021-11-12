---
sidebar_position: 4
---

# Deploy To Rinkeby

## Create a Safe

Navigate to [rinkeby.gnosis-safe.io/app/](https://rinkeby.gnosis-safe.io/app/#/) and create a new Gnosis Safe.

![Gnosis Safe: create](/img/tutorial/build_module_07.png)

## Deploy your Button and Module

Head back to Remix and change your provider to "injected web3" to connect to metamask. Make sure you metamask is connected to Rinkeby.

![Remix: change providers](/img/tutorial/build_module_08.png)

Deploy your `Button` contract and make sure to set its owner to your newly created safe's address. Make sure you have `Button.sol` opened, otherwise it will not show up in the "Deploy and Run Transactions" tab.

Deploy your `MyModule`, using your newly created safe's address for the `_owner` parameter and your newly deployed Button contract's address for the `_button` parameter. Make sure you have `MyModule.sol` opened, otherwise it will not show up in the "Deploy and Run Transactions" tab.

In the Gnosis Safe app, navigate to the "apps" tab and select the Zodiac Safe App.

![Gnosis Safe: Zodiac App](/img/tutorial/build_module_09.png)

Select "custom module", enter the address of your newly deployed module, and hit "Add Module".

![Zodiac App: custom module](/img/tutorial/build_module_10.png)

Once the transaction confirms, you should see your new module show up in your list of enabled modules.

## Verify on Etherscan

If you want to interact with your module in the Zodiac Safe app, you'll need to verify its source code on Etherscan.

Open your module on Etherscan by clicking the Etherscan button next to your contract's address.

![Zodiac App: Etherscan](/img/tutorial/build_module_12.png)

Navigate to the "Contract" tab and select "verify and publish".

![Etherscan: Code tab](/img/tutorial/build_module_13.png)

Enter your module's address.

Select compiler type "Solidity (single file)".

Select your compiler version, making sure it matches the version selected in the "Solidity Compiler" tab on Remix.

Choose a license and then hit continue.

![Etherscan: Verify and Publish](/img/tutorial/build_module_14.png)

In Remix, add the "Flattener" plugin from the "Plugin Manager" tab.

![Remix: Add Plugin](/img/tutorial/build_module_16.png)

Select "MyModule.sol" and then click the button to copy the flattened code to your clipboard.

![Remix: Copy flattened code](/img/tutorial/build_module_19.png)

Back in Etherscan, paste your flattened code into the text box.

Make sure your optimization settings match what you have selected in the Solidity compiler on Remix.

Then press verify and publish.

![Remix: Copy flattened code](/img/tutorial/build_module_20.png)

If all goes well, you should see a success screen on Etherscan and if you refresh the Zodiac app you should more details about your Module.

![Etherscan: Verify and Publish](/img/tutorial/build_module_21.png)

![Zodiac App: custom module](/img/tutorial/build_module_22.png)

## Push the button!

Back in remix, try pushing the button in your `MyModule` contract.

Once that transaction has confirmed, you should see a new "contract interaction" item in your safe's transaction history.

![Gnosis Safe: Transaction History](/img/tutorial/build_module_11.png)

Congratulations!

You've successfully built a Zodiac module, deployed it to a public test network, and controlled a Gnosis Safe with it.
