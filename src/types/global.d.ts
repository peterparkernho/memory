import { Wallet, ethers } from "ethers";
import { JSONRPCServerAndClient } from "json-rpc-2.0";

export { };
  
type DomToImage = {
  toSvg: (node: HTMLElement) => Promise<string>;
}

export type Message = {
  user: string;
  createdAt: string;
  message: string;
}

declare global {
  interface Window {
    seed: number;
    domtoimage: DomToImage;
    collectionName: string;
    circleInfo: {
      name: string;
    };
    brief: {
      item: Message;
      replyTo?: Message;
    };
    histories: Message[];
  }
}

