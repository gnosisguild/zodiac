---
sidebar_position: 2
---

# Add template

Next you should click on the Reality Module available through the Zodiac App on Gnosis Safe. When you open the Reality Module, it will look like this:

![Reality Module interface](/img/tutorial/reality_1.jpg)

Next, you should fill in the Parameters.

The first parameter, `Oracle Address` comes pre-filled. This address points to the currently Reality.eth V3 oracle contracts. Depending on the network you are on, you may need to replace this value with one from the Template Builder.

The second parameter, `TemplateId` corresponds to the format in which successful DAO proposals will be verified by the oracle. Let's continue below to give you a better sense of what that means.

## Template builder

Click on the link at the right top of the TemplateId parameter that says "Get a template here". This will take you to the Reality.eth Template Builder page.

![Reality.eth Template Builder](/img/tutorial/reality_4.jpg)

When you arrive at the Template Builder, select the appropriate Reality Instance (Eth for this example), and 'Zodiac Reality Module' as the template type. The Zodiac Reality Module type has defaults set for connecting the Reality Module to Safesnap. If you need a more specific setup, use the 'Custom' type.

`Language` can be freely chosen, as it is only used on the Reality.eth web interface.

Enter in an appropriate ENS name, this will be used in the question template (e.g. "Did the Snapshot proposal with the id %s in the YOUR_ENS_NAME space pass..."). It does not have to be an actual ENS domain name, but often is when used in conjunction with the SafeSnap plugin.

Once you fill in the fields, the generated template json will show.

For a deeper dive on creating Reality.eth templates, see https://github.com/realitio/realitio-dapp#structuring-and-fetching-information.

## Create template

When satisfied with your template, click the `Create Template` at the bottom of the page, and confirm the transaction with your web3 wallet.

![Reality.eth Template Example](/img/tutorial/reality_5.jpg)

This should return a page like the above. Your `TemplateId` can be found at the top of the page. In this example, the TemplateId is 30. Also take note of the address in the `Reality Instance` field. You will need this and the `TeamplateId` when deploying the Reality module.
