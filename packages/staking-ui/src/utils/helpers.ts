import { message } from "antd";
import prompt from "antd-prompt";
import BigNumber from "bignumber.js";
import { BasStore } from "src/stores/BasStore";

export const delegate = async (store: BasStore, validator: string): Promise<void> => {
  const amount = await prompt({
    title: '输入委托金额 (BitPlanet: RC): ',
    rules: [
      {
        required: true,
        message: "您必须输入令牌数量"
      }
    ],
    modalProps: {
      width: '400px',
    }
  });

  if (!amount) return;
  const bigAmount = new BigNumber(amount).multipliedBy(10**18).toString(10)

  try {
    const result = await store.getBasSdk().getStaking().delegateTo(validator, `${bigAmount}`);
    const receipt = await result.receipt;
    console.log(`Receipt: ${JSON.stringify(receipt, null, 2)}`);

    message.success('委托已完成!');
  } catch {
    message.error('委托失败...重试!');
  }
}
export const undelegate = async (store:BasStore, validator: string, defaultAmount = '0'): Promise<void> => {
  const amount = await prompt({
    title: '输入取消授权金额（BitPlanet:RC） ',
    rules: [
      {
        required: true,
        message: "您必须输入令牌数量"
      }
    ],
    value: defaultAmount,
  })
  
  if (!amount) return;
  const bigAmount = new BigNumber(amount).multipliedBy(10**18).toString(10)

  try {
    const result = await store.getBasSdk().getStaking().undelegateFrom(validator, `${bigAmount}`);
    
    const receipt = await result.receipt;
    console.log(`Receipt: ${JSON.stringify(receipt, null, 2)}`);

    message.success('取消授权已完成!');
  } catch (e) {
    console.log(e)
    message.error('取消委托失败...重试!',)
  }
}

export const claimRewards = async (store:BasStore, validator: string): Promise<void> => {
  try {
    console.log(`Claiming validator fee: ${validator}`);
    const result = await store.getBasSdk().getStaking().claimDelegatorFee(validator);

    const receipt = await result.receipt;
    console.log(`Receipt: ${JSON.stringify(receipt, null, 2)}`);

    message.success('获取成功!');
  } catch (e) {
    console.log(e)
    message.error('获取失败...重试!')
  }
}

export const releaseFromJail = async (store:BasStore, validator: string): Promise<void> => {
  try {
    console.log(`Releasing validator from jail: ${validator}`);
    const result = await store.getBasSdk().getStaking().releaseValidatorFromJail(validator);

    const receipt = await result.receipt;
    console.log(`Receipt: ${JSON.stringify(receipt, null, 2)}`);

    message.success('Release is done!');
  } catch (e) {
    console.log(e)
    message.error('Release has failed...try again!')
  }
}

