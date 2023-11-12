import { Spin, Typography } from "antd";
import { observer } from "mobx-react";
import { useBasStore } from "src/stores";
import { useLocalFetchDataStore } from "src/stores/FetchDataStore";

const { Title, Text } = Typography;

export const AccountData = observer(() => {
  const store = useBasStore();

  const availableAmount = useLocalFetchDataStore<string>(async () => {
    let availableAmountTemp = '0';
    try {
      const avail = await store.getBasSdk().getStaking().getMyAvailableReDelegateAmount();
      availableAmountTemp = avail.toString(10);
    } catch (e) {
      console.error(e);
    }
    return availableAmountTemp;
  });

  const delegatedAmount = useLocalFetchDataStore<string>(async () => {
    let delegatedAmountTemp = '0';
    try {
      const avail = await store.getBasSdk().getStaking().getDelegatorDelegatedAmount(
        store.getBasSdk().getKeyProvider().getMyAddress(),
      );
      delegatedAmountTemp = avail.toFixed(4);
    } catch (e) {
      console.error(e);
    }
    return delegatedAmountTemp;
  });

  return (
    <div className="accountDataCArd">
      <div className="">
        <Title level={5} type='secondary'>
          重新委托金额
        </Title>
        {
          availableAmount.isLoading
          ? <Spin size="default" />
          : (
            <Text strong className="cardBody">
              {availableAmount.item} RC
            </Text>
          )
        }
      </div>
      <div>
        <Title level={5} type='secondary'>
          委托总金额
        </Title>
        {
          delegatedAmount.isLoading
          ? <Spin size="default" />
          : (
            <Text strong  className="cardBody">
              {delegatedAmount.item} RC
            </Text>
          )
        }
      </div>
    </div>
  )
});