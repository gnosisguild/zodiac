import { bridge_1_0_0_ABI } from "./bridge/1.0.0.js";
import { circulatingSupplyERC20_1_0_0_ABI } from "./circulatingSupplyERC20/1.0.0.js";
import { circulatingSupplyERC20_1_1_0_ABI } from "./circulatingSupplyERC20/1.1.0.js";
import { circulatingSupplyERC20_1_2_0_ABI } from "./circulatingSupplyERC20/1.2.0.js";
import { circulatingSupplyERC721_1_1_0_ABI } from "./circulatingSupplyERC721/1.1.0.js";
import { circulatingSupplyERC721_1_2_0_ABI } from "./circulatingSupplyERC721/1.2.0.js";
import { connext_1_0_0_ABI } from "./connext/1.0.0.js";
import { delay_1_0_0_ABI } from "./delay/1.0.0.js";
import { delay_1_0_1_ABI } from "./delay/1.0.1.js";
import { delay_1_1_0_ABI } from "./delay/1.1.0.js";
import { delay_1_1_1_ABI } from "./delay/1.1.1.js";
import { erc20Votes_1_0_0_ABI } from "./erc20Votes/1.0.0.js";
import { erc721Votes_1_0_0_ABI } from "./erc721Votes/1.0.0.js";
import { exit_1_0_0_ABI } from "./exit/1.0.0.js";
import { exit_1_1_0_ABI } from "./exit/1.1.0.js";
import { exit_1_2_0_ABI } from "./exit/1.2.0.js";
import { exitERC721_1_1_0_ABI } from "./exitERC721/1.1.0.js";
import { exitERC721_1_2_0_ABI } from "./exitERC721/1.2.0.js";
import { factory_1_0_0_ABI } from "./factory/1.0.0.js";
import { factory_1_1_0_ABI } from "./factory/1.1.0.js";
import { factory_1_2_0_ABI } from "./factory/1.2.0.js";
import { metaGuard_1_0_0_ABI } from "./metaGuard/1.0.0.js";
import { multisendEncoder_1_0_0_ABI } from "./multisendEncoder/1.0.0.js";
import { optimisticGovernor_1_2_0_ABI } from "./optimisticGovernor/1.2.0.js";
import { ozGovernor_1_0_0_ABI } from "./ozGovernor/1.0.0.js";
import { realityERC20_2_0_0_ABI } from "./realityERC20/2.0.0.js";
import { realityETH_2_0_0_ABI } from "./realityETH/2.0.0.js";
import { roles_1_0_0_ABI } from "./roles/1.0.0.js";
import { roles_1_1_0_ABI } from "./roles/1.1.0.js";
import { roles_2_1_0_ABI } from "./roles/2.1.0.js";
import { roles_2_1_1_ABI } from "./roles/2.1.1.js";
import { scopeGuard_1_0_0_ABI } from "./scopeGuard/1.0.0.js";
import { tellor_2_1_0_ABI } from "./tellor/2.1.0.js";

export const ABIs = {
  bridge: {
    "1.0.0": bridge_1_0_0_ABI,
  },
  circulatingSupplyERC20: {
    "1.0.0": circulatingSupplyERC20_1_0_0_ABI,
    "1.1.0": circulatingSupplyERC20_1_1_0_ABI,
    "1.2.0": circulatingSupplyERC20_1_2_0_ABI,
  },
  circulatingSupplyERC721: {
    "1.1.0": circulatingSupplyERC721_1_1_0_ABI,
    "1.2.0": circulatingSupplyERC721_1_2_0_ABI,
  },
  connext: {
    "1.0.0": connext_1_0_0_ABI,
  },
  delay: {
    "1.0.0": delay_1_0_0_ABI,
    "1.0.1": delay_1_0_1_ABI,
    "1.1.0": delay_1_1_0_ABI,
    "1.1.1": delay_1_1_1_ABI,
  },
  erc20Votes: {
    "1.0.0": erc20Votes_1_0_0_ABI,
  },
  erc721Votes: {
    "1.0.0": erc721Votes_1_0_0_ABI,
  },
  exit: {
    "1.0.0": exit_1_0_0_ABI,
    "1.1.0": exit_1_1_0_ABI,
    "1.2.0": exit_1_2_0_ABI,
  },
  exitERC721: {
    "1.1.0": exitERC721_1_1_0_ABI,
    "1.2.0": exitERC721_1_2_0_ABI,
  },
  factory: {
    "1.0.0": factory_1_0_0_ABI,
    "1.1.0": factory_1_1_0_ABI,
    "1.2.0": factory_1_2_0_ABI,
  },
  metaGuard: {
    "1.0.0": metaGuard_1_0_0_ABI,
  },
  multisendEncoder: {
    "1.0.0": multisendEncoder_1_0_0_ABI,
  },
  optimisticGovernor: {
    "1.2.0": optimisticGovernor_1_2_0_ABI,
  },
  ozGovernor: {
    "1.0.0": ozGovernor_1_0_0_ABI,
  },
  realityERC20: {
    "2.0.0": realityERC20_2_0_0_ABI,
  },
  realityETH: {
    "2.0.0": realityETH_2_0_0_ABI,
  },
  roles: {
    "1.0.0": roles_1_0_0_ABI,
    "1.1.0": roles_1_1_0_ABI,
    "2.1.0": roles_2_1_0_ABI,
    "2.1.1": roles_2_1_1_ABI,
  },
  scopeGuard: {
    "1.0.0": scopeGuard_1_0_0_ABI,
  },
  tellor: {
    "2.1.0": tellor_2_1_0_ABI,
  },
} as const;
