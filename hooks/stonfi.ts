import { OneclickTONDefi } from "../constants/interfaces";
import TonWeb from 'tonweb';

import { Router, ROUTER_REVISION, ROUTER_REVISION_ADDRESS } from '@ston-fi/sdk';

export class Stonefi implements OneclickTONDefi {

  protected static instance: Stonefi;

  protected constructor() {
  }

  public static getInstance(): Stonefi {
    if (!Stonefi.instance) {
      Stonefi.instance = new Stonefi();
    }

    return Stonefi.instance;
  }

  public async addLiquidity(account: string,provider,token1: string, token2: string, amount1: string, amount2: string, sender: any): Promise<any> {

    const JETTON0 = 'EQA2kCVNwVsil2EM2mB0SkXytxCqQjS4mttjDpnXmwG9T6bO'; // STON
    const JETTON1 = 'EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA'; // jUSDT

    const router = new Router(provider, {
      revision: ROUTER_REVISION.V1,
      address: ROUTER_REVISION_ADDRESS.V1,
    });
    
    console.log(router,"router address")

    // transaction to provide 0.5 JETTON0 to JETTON0/JETTON1 pool
    const jetton0ProvisionTxParams =
      await router.buildProvideLiquidityJettonTxParams({
        // address of the wallet that holds jetton you want to provide
        userWalletAddress: account,
        // address of the jetton you want to provide
        sendTokenAddress: JETTON0,
        // amount of the jetton you want to provide
        sendAmount: new TonWeb.utils.BN('500000000'),
        // address of the second jetton you want to provide
        otherTokenAddress: JETTON1,
        // minimal amount of the LP tokens you want to receive as a result of the provision
        minLpOut: new TonWeb.utils.BN(1),
        // query id to identify your transaction in the blockchain (optional)
        queryId: 12345,
      });

    // to execute the transaction you need to send transaction to the blockchain
    // (replace with your wallet implementation, logging is used for demonstration purposes)
    console.log({
      to: jetton0ProvisionTxParams.to,
      amount: jetton0ProvisionTxParams.gasAmount,
      payload: jetton0ProvisionTxParams.payload,
    });

    // transaction to provide 0.2 JETTON1 to to JETTON0/JETTON1 pool
    const jetton1ProvisionTxParams =
      await router.buildProvideLiquidityJettonTxParams({
        // address of the wallet that holds jetton you want to provide
        userWalletAddress: account,
        // address of the jetton you want to provide
        sendTokenAddress: JETTON1,
        // amount of the jetton you want to provide
        sendAmount: new TonWeb.utils.BN('200000000'),
        // address of the second jetton you want to provide
        otherTokenAddress: JETTON0,
        // minimal amount of the LP tokens you want to receive as a result of the provision
        minLpOut: new TonWeb.utils.BN(1),
        // query id to identify your transaction in the blockchain (optional)
        queryId: 12345,
      });

    // to execute the transaction you need to send transaction to the blockchain
    // (replace with your wallet implementation, logging is used for demonstration purposes)
    console.log({
      to: jetton1ProvisionTxParams.to,
      amount: jetton1ProvisionTxParams.gasAmount,
      payload: jetton1ProvisionTxParams.payload,
    });

    // after execution of both transactions liquidity provision process will be completed
    // and you will receive pool LP tokens

  }

  approve(): void {
  }

  mint(): void {
  }

  removeLiquidity(): void {
  }

  revoke(): void {
  }

  public async swap(account: string, provider, tokenFrom: string, tokenTo: string, amountIn: string, amountOut: string, sender : any): Promise<any> {
    
    const  JETTON0 = 'EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728'; // STON
    //JETTON0 = 'UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ'; // TON
    const JETTON1 = 'EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA'; // jUSDT

    const router = new Router(provider, {
      revision: ROUTER_REVISION.V1,
      address: ROUTER_REVISION_ADDRESS.V1,
    });

    console.log(router,"router address is here")

    // transaction to swap 1.0 JETTON0 to JETTON1 but not less than 1 nano JETTON1
    const swapTxParams = await router.buildSwapJettonTxParams({
      // address of the wallet that holds offerJetton you want to swap
      userWalletAddress: account,
      // address of the jetton you want to swap
      offerJettonAddress: tokenFrom,
      // amount of the jetton you want to swap
      offerAmount: new TonWeb.utils.BN('1000000000'),
      // address of the jetton you want to receive
      askJettonAddress: tokenTo,
      // minimal amount of the jetton you want to receive as a result of the swap.
      // If the amount of the jetton you want to receive is less than minAskAmount
      // the transaction will bounce
      minAskAmount: new TonWeb.utils.BN(1),
      // query id to identify your transaction in the blockchain (optional)
      queryId: 12345,
      // address of the wallet to receive the referral fee (optional)
      referralAddress: undefined,
    });

    // to execute the transaction you need to send transaction to the blockchain
    // (replace with your wallet implementation, logging is used for demonstration purposes)
    console.log({
      to: swapTxParams.to,
      amount: swapTxParams.gasAmount,
      payload: swapTxParams.payload,
    });

    sender.send({
      to: swapTxParams.to,
      value: swapTxParams.gasAmount,
      body: swapTxParams.payload,
    });

    // reverse transaction is the same,
    // you just need to swap `offerJettonAddress` and `askJettonAddress` values
    // and adjust `offerAmount` and `minAskAmount` accordingly
  }

}
