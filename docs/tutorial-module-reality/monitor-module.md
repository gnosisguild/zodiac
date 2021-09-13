---
sidebar_position: 6
---

# Monitor module

As anyone can submit proposals to your Reality Module, it is strongly recommended to put in place monitoring practices. The Reality Module relies on the oracle (e.g. Reality.eth) to provide the correct answer, so that no malicious transactions are executed. In the worst case, the avatar can invalidate a submitted proposal. 

To make sure that all of the involved stakeholders can react in a timely manner, the events emitted by the module contract should be monitored. Each time a new proposal is submitted, the contract will emit a `ProposalQuestionCreated` event with the following parameters:
```
event ProposalQuestionCreated(
    bytes32 indexed questionId, // e.g. Reality.eth question id
    string indexed proposalId // e.g. Snapshot proposal id
);
```

There are different services available for monitoring such as the [OpenZepplin Defender Sentinel](https://docs.openzeppelin.com/defender/sentinel).