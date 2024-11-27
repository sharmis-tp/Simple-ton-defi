
export interface OneclickTONDefi {
  mint(): void;
  approve(): void
  swap(account, provider,tokenFrom: string, tokenTo: string, amountIn: string, amountOut: string, sender?: any): Promise<any>;
  revoke(): void
  addLiquidity(account: string,provider,token1: string, token2: string, amount1: string, amount2: string, sender?: any): Promise<any>
  removeLiquidity(): void
}
