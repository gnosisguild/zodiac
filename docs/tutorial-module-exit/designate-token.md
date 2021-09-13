---
sidebar_position: 2
---

# Designate token

Next you should click on the Exit Module available through the Zodiac App on Gnosis Safe. When you open the Exit Module, it will look like this:

![Exit Module](/img/tutorial/exit_1.png)

The Exit Module prompts you to enter a `Token Contract Address` and a `Circulating Supply Amount`. The Token Contract Address and Circulting Supply Amount refer to the ERC20 token participants can redeem for a proportional share of this account’s compatible ERC20 digital assets.

## Token Contract Address

If you need to find the Token Contract Address, look up the token on a block explorer like [https://etherscan.io](https://etherscan.io). Be sure to verify these details are correct, and do not correspond to another similarly named token. We can help you in the [Gnosis Guild Discord](https://discord.gg/wwmBWTgyEq) if you have any questions. 


## Circulating Supply Amount

This is how you can define the token's circulating supply. Rather than directly reading the token's circulating supply on-chain, this allows you to define the amount in case there are tokens held by the DAO that should not count towards the circulating supply.

If you need to find the Circulating Supply Amount, look up the token on a token tracker with historical data like [https://coinmarketcap.com](https://coinmarketcap.com/). Be sure to verify these details are correct, and do not correspond to another similarly named token. We can help you in the [Gnosis Guild Discord](https://discord.gg/wwmBWTgyEq) if you have any questions. 


In this tutorial, we'll use the [XEENUS](https://rinkeby.etherscan.io/token/0x022e292b44b5a146f2e8ee36ff44d3dd863c915c?a=0x9313f9b6a2255f46ca963780665e51afb80bd15a) token, a test token on the Rinkeby testnetwork. 