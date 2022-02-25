---
sidebar_position: 3
---

# Add Role

After confirming the transaction, you should return to the Zodiac App, where your configured Role Modifier will be displayed in the left side panel. Click anywhere on the modifier's card to access the Roles App.

------
*Image of the Roles Modifier card in Zodiac App*

## Create a Role

------
*Image of the Roles App zero state*

Click on the "Create a Role" button to open the Role view where you can add members and targets to the role. The Role name is created automatically.

------
*Image of Create Role View*

Once you've added the appropriate members and targets to this role (see below), you can click "Create Role". Only then will your changes to the role be saved. Note that you must connect your wallet (and be a key signer in connected safe) in order to create the role.


## Members
Members are accounts that that the role is assigned to. Once an account is assigned the role, it can call the targets on behalf of the avatar by passing transactions to the avatar for execution (via the Roles Modifier).


## Targets
Targets are the accounts that the members can interact with on behalf of the avatar.

Targets can have detailed permission configurations, like what functions can be called and which arguments are allowed in the function call.

Enter the appropriate target address and target execution option.

- **`None`**: Can execute normal transactions on behalf of the target with `value` set to `0`.
- **`Send`**: Same as `None` but can also send value (from the avatar).
- **`DelegatedCall`**: Can perform delegated calls. This uses the [DELEGATECALL](https://www.evm.codes/#f4) opcode to execute the code at the target destination in the contexts of the avatar (the avatar's storage, sender, and value) as if the code was a part of the calling contract.
- **`Both`**: Can execute both delegatedCall and normal transactions with or without value.

After the target is created, it can be selected in the left side panel, and configured in the right panel.