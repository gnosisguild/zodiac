const { ethers } = require("ethers");

exports.handler = async function (event) {
  console.log(
    "\n\n/************************** EVENT *****************************/"
  );
  console.log(JSON.stringify(event));
  console.log(
    "/**********************************************************/\n\n"
  );
  if (event && event.request && event.request.body) {
    // variables from autotask creation
    const nodeProvider = "{{nodeProvider}}";
    const { transaction } = event.request.body;
    const txHash = transaction.transactionHash;
    const provider = new ethers.providers.JsonRpcProvider(nodeProvider);
    const tx = await provider.getTransaction(txHash);
    console.log(
      "\n\n/*********************** TRANSACTION **************************/"
    );
    console.log(JSON.stringify(tx));
    console.log(
      "/**********************************************************/\n\n"
    );
  }
};
