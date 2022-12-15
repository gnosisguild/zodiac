import { Network } from "defender-base-client";
import fs from "fs";
import JSZip from "jszip";
import { SupportedNetworks } from "../../src/factory/contracts";

export const defenderNetworkToSupportedNetwork = (networks: Network) => {
  switch (networks) {
    case "mainnet":
      return SupportedNetworks.Mainnet;
    case "goerli":
      return SupportedNetworks.Goerli;
    case "xdai":
      return SupportedNetworks.GnosisChain;
    default:
      throw new Error(`Unsupported network ${networks}`);
  }
};

export const readFileAndReplace = (
  filePath: string,
  replaceMap: { [toReplace: string]: string }
) => {
  const buffer = fs.readFileSync(filePath);
  let fileContent = buffer.toString();
  Object.keys(replaceMap).forEach((key) => {
    fileContent = fileContent.replace(key, replaceMap[key]);
  });
  return fileContent;
};

export const packageCode = async (code: string) => {
  const zip = new JSZip();
  zip.file("index.js", code, { binary: false });
  const zippedCode = await zip.generateAsync({ type: "nodebuffer" });
  return zippedCode.toString("base64");
};
