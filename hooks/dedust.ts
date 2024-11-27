import { OneclickTONDefi } from "../constants/interfaces";
import { Factory, MAINNET_FACTORY_ADDR } from '@dedust/sdk';
import { Address, TonClient4 } from "@ton/ton";


export class DeDustFi implements OneclickTONDefi {

    protected static instance: DeDustFi;

    private constructor() {
        const tonClient = new TonClient4({ endpoint: "https://mainnet-v4.tonhubapi.com" });
        const factory = tonClient.open(Factory.createFromAddress(MAINNET_FACTORY_ADDR));
    }

    addLiquidity(account: string,provider,token1: string, token2: string, amount1: string, amount2: string): Promise<any> {
        return;
    }
  
    approve(): void {
    }
  
    mint(): void {
    }
  
    removeLiquidity(): void {
    }
  
    revoke(): void {
    }
  
    public async swap(account,provider,tokenFrom: string, tokenTo: string, amountIn: string, amountOut: string): Promise<any> {
  
    }
  

}
