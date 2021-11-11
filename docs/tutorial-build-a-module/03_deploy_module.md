---
sidebar_position: 3
---

# Deploy Your Module

Now that your module is compiling, it's time to deploy it on your local test environment.

Use the address of your previously deployed `MockSafe` as for the `owner` parameter, and the address of your previously deployed `Button` for the `button` parameter.

Once it's deployed, you can expand it to see your `pushButton()` function, along with a handful of other functions and variables imported from `Module.sol`.

![Remix: deploy module](/img/tutorial/build_module_06.png)

Before your `pushButton` function will work, you'll need to enable your module on your safe by calling the `enableModule()` function.

> _Note: a real Gnosis Safe can have multiple modules enabled at once, but our Mock Safe can have only one._

## Push the button!

Now for the moment of truth. Hit the `pushButton()` function on your deployed `MyModule` and then hit `pushes` to see the glorious fruits of your labors.

Go ahead, push it a few more times. You've earned it.

Make sure to try pushing the button directly in the button contract to confirm that it fails unless it is called by the safe.

Now you're ready to do this on a real Gnosis Safe!
