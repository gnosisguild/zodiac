---
sidebar_position: 1
---

# Setup

## Welcome

In this tutorial, you'll learn the the fundamental concepts of Zodiac modules while you build a super-simple example module. Deploying it first on a local test environment to control a mock [Gnosis Safe](http://gnosis-safe.io/), and later using it to control a real Gnosis Safe on a public test network.

## Setup IDE

For this tutorial, we'll make use of [Remix](https://remix.ethereum.org/), a powerful web-based IDE for building Ethereum applications. However, if you would prefer to use some other developer environment, the instructions should port easily to wherever you like to work.

Start by importing [this gist](https://gist.github.com/auryn-macmillan/105ae8f09c34406997d217ee4dc0f63a).
![Remix: insert from gist](/img/tutorial/build_module_01.png)

This will add three files to your working directory: `Button.sol`, `MockSafe.sol`, and `MyModule.sol`.

![Remix: files](/img/tutorial/build_module_02.png)

Alternatively, you can create each of the files manually and copy the code from [the gist](https://gist.github.com/auryn-macmillan/105ae8f09c34406997d217ee4dc0f63a).

`Button.sol` is a silly little contract with one function, `pushButton()`, which increments a counter, `pushes`. The `pushButton()` function is only callable by the contracts "owner", which will be our Gnosis Safe.

`MockSafe.sol` is a mock of the Gnosis Safe that we'll use for simplicity as we build and test in our local environment. Later we'll replace it with a real Gnosis Safe on a public test network to make sure our really works.

`MyModule.sol` is where you'll be adding your own code to control our Gnosis Safes and make it push the button in our `Button.sol` contract.

## Deploy Button and MockSafe

Before we write any of our own code, we should deploy our Button and MockSafe contracts to our local environment.

Navigate to the "Solidity Compiler" tab and check "Auto compile". This will re-compile your contract each time you make a change.

![Remix: autocompile](/img/tutorial/build_module_03.png)

With `Button.sol` open, navigate to the "Deploy & Run Transactions" tab, select "Button" from the contracts dropdown, and hit "deploy". Do the same for `MockSafe.sol`.

![Remix: deploy](/img/tutorial/build_module_04.png)

You should now see two items have appeared, one each for `Button.sol` and `MockSafe.sol`. You can expand the view of either by clicking the carat to the left of the name, exposing the variables and functions for the contract.

You can test that your button works by pushing the "pushes" button on your deployed Button. It should return `0`. Now push the "pushButton" button and then then "pushes" button again, this time it should return `1`.

Copy the address of your `MockSafe`, expand your deployed `Button`, and call the `transferOwnership()` function, pasting in your MockSafe's address for the parameter.

![Remix: transfer ownership](/img/tutorial/build_module_04.png)

Now that you've transferred ownership, pushing the "pushButton" button on your Button will now fail. Rather, you'll need make your MockSafe execute the transaction.

Expand your MockSafe and call the `exec` function with the following parameters:

- **to:** `{address of your deployed Button contract}`
- **value:** `0`
- **data:** `"0x0a007972"` _(the ABI encoded function signature for the `pushButton()` function)_

Clicking the "pushes" button on your Button should now show that `pushes` has been incremented again.

Your set up, huzzah! 🎉
Let's start building!
