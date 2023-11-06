import {BasSdk, IChainConfig, IChainParams, IConfig, IExplorerConfig, IValidator} from "@bpc/rc-javascript-sdk";
import {action, makeAutoObservable, reaction} from "mobx";
import prettyTime from "pretty-time";

const makeExplorerConfig = (explorerUrl: string): IExplorerConfig => {
  if (!explorerUrl.endsWith('/')) explorerUrl += '/';
  return {
    homePage: `${explorerUrl}`,
    txUrl: `${explorerUrl}tx/{tx}`,
    addressUrl: `${explorerUrl}address/{address}`,
    blockUrl: `${explorerUrl}block/{block}`,
  };
}

export const makeDefaultConfig = (chainId: number, chainName: string, rpcUrl: string, explorerConfig?: IExplorerConfig | string): IConfig => {
  if (typeof explorerConfig === 'string') {
    explorerConfig = makeExplorerConfig(explorerConfig);
  }
  return {
    chainId,
    chainName,
    rpcUrl,
    explorerConfig,
    // resouce -compatible contracts
    stakingAddress: '0x0000000000000000000000000000000000001000',
    slashingIndicatorAddress: '0x0000000000000000000000000000000000001001',
    systemRewardAddress: '0x0000000000000000000000000000000000001002',
    // custom contracts
    stakingPoolAddress: '0x0000000000000000000000000000000000007001',
    governanceAddress: '0x0000000000000000000000000000000000007002',
    chainConfigAddress: '0x0000000000000000000000000000000000007003',
    runtimeUpgradeAddress: '0x0000000000000000000000000000000000007004',
    deployerProxyAddress: '0x0000000000000000000000000000000000007005',
  }
}

export const LOCAL_CONFIG: IConfig = makeDefaultConfig(1600, 'BPC-RC devnet #2', 'http://192.168.2.110:8545/','http://192.168.2.110:4000/')
export const DEV_CONFIG: IConfig = makeDefaultConfig(16002, 'BPC-RC devnet #1', 'http://rpc.testnet.bitplanet.global:8545/', 'http://explorer.testnet.bitplanet.global:4000/')

export const CONFIGS: Record<string, IConfig> = {
  "localhost": makeDefaultConfig(16005, 'BPC-RC devnet #2', 'http://192.168.2.110:8545/','http://192.168.2.110:4000/'),
  "devnet-1": makeDefaultConfig(16002, 'BPC-RC devnet #1', 'http://rpc.testnet.bitplanet.global:8545/', 'http://explorer.testnet.bitplanet.global:4000/'),
};

export class BasStore {

  public isConnected = false

  private readonly sdk: BasSdk

  public constructor(public readonly config: IConfig) {
    this.sdk = new BasSdk(config)
    makeAutoObservable(this)
  }

  public getBasSdk(): BasSdk {
    return this.sdk
  }

  public getConfigs(): Record<string, IConfig> {
    return CONFIGS;
  }

  @action
  public async connectFromInjected(): Promise<void> {
    this.isConnected = false
    if (!this.sdk.isConnected()) {
      await this.sdk.connect()
    }
    this.isConnected = true
    try {
      const block = await this.getChainConfig()
      console.log(`Block Info: ${JSON.stringify(block, null, 2)}`)
    } catch (e) {
      console.error(e);
    }
  }

  public async getChainConfig(): Promise<IChainConfig & IChainParams> {
    const chainConfig = await this.sdk.getChainConfig();
    const chainParams = await this.sdk.getChainParams();
    const result = {...chainConfig, ...chainParams}
    this.cachedChainConfig = result;
    return result;
  }

  private cachedChainConfig?: IChainConfig & IChainParams;

  public async getLatestChainConfig(): Promise<IChainConfig & IChainParams> {
    if (this.cachedChainConfig) return this.cachedChainConfig;
    return this.getChainConfig();
  }

  public async getReleaseInterval(validator: IValidator): Promise<{
    remainingBlocks: number;
    prettyTime: string;
  }> {
    const {blockNumber, blockTime, epochBlockInterval, nextEpochBlock, epoch} = await this.getChainConfig();
    if (validator.jailedBefore === 0) {
      return {remainingBlocks: 0, prettyTime: 'not in jail'};
    }
    if (epoch < validator.jailedBefore) {
      return {remainingBlocks: 0, prettyTime: 'can be released'};
    }
    const remainingBlocks = (Number(validator.jailedBefore) - epoch) * epochBlockInterval + (nextEpochBlock - blockNumber);
    const remainingTime = prettyTime(remainingBlocks * blockTime * 1000 * 1000 * 1000, 'm')
    return {remainingBlocks, prettyTime: remainingTime}
  }
}