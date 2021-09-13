---
sidebar_position: 2
---

# Add template

Next you should click on the Reality Module available through the Zodiac App on Gnosis Safe. When you open the Reality Module, it will look like this:

![Reality Module interface](/img/tutorial/reality_1.png)

Next, you should fill in the Parameters.

The first parameter, `Oracle Address` comes pre-filled. This address points to the currently Reality.eth V3 oracle contracts. There is no need for beginner users to change this parameter.

The second parameter, `TemplateId` corresponds to the format in which successful DAO proposals will be verified by the oracle. Let's continue below to give you a better sense of what that means.

## Template builder

Click on the link at the right top of the TemplateId parameter that says "Get a template here". This will take you to the Reality.eth Template Builder page.

![Reality.eth Template Builder](/img/tutorial/reality_2.png)

For the Reality Module to work correctly, the template you create should have the following format:

```
{
    "lang": "en",
    "type": "bool",
    "category": "DAO Proposal",
    "title": "Did the proposal with the id %s pass the execution of the transactions with hash 0x%s?"
}
```

Some notes on what each field means and its importance: 
* `Category` and `Language` can be freely choosen, as they are only used on the Reality.eth web interface.
* `Type` **must** be set to bool, because the Reality Module expects the reported outcome to be true, false or INVALID.
* `Title` **must** include two %s placeholders:
    * The first %s placeholder is for the id of the proposal (e.g. an IPFS hash).
    * The second placeholder is for the hash of the concatenation of the EIP-712 transaction hashes (see the README for more information).

_DISCLAIMER: DO NOT BLINDLY COPY THE REQUIREMENTS HERE. You should check the requirements and make the adjustments for your setup._

For an existing example, you can visit the [🍯DAO space configuration](https://cloudflare-ipfs.com/ipfs/QmahDCSkdED9BLZ3VtH6aJ8P5TmvMYEfA7fJa4hGsvEpi2/) for one example of practices around using the Reality Module. For a deeper dive on creating Reality.eth templates, see https://github.com/realitio/realitio-dapp#structuring-and-fetching-information.

## Create template

When satisfied with your template, click the `Create Template` at the bottom of the page, and confirm the transaction with your web3 wallet.

![Reality.eth Template Example](/img/tutorial/reality_3.png)

This should return a page like the above. Your `TemplateId` can be found at the top of the page. In this example, the TemplateId is 31.

