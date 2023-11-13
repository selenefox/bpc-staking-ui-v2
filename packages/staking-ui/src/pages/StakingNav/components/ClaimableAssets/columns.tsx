import {IStakingRewards, IValidator} from "@bpc/rc-javascript-sdk";
import {Button} from "antd";
import {ColumnProps} from "antd/lib/table";
import {BigNumber} from "bignumber.js";
import {BasStore} from "src/stores/BasStore";
import {claimRewards} from "src/utils/helpers";

export const createTableColumns = (store: BasStore): ColumnProps<any>[] => {

  const handleClaimRewards = async (record: IStakingRewards) => {
    await claimRewards(store, record.validator.validator);
  }

  return [
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (value: BigNumber) => {
        return value.toString(10)
      }
    },
    {
      title: '超级节点',
      dataIndex: 'validator',
      key: 'validator',
      render: (value: IValidator) => {
        return value.validator
      }
    },
    {
      title: '操作',
      render: (record: IStakingRewards) => {
        return (
          <div className="flexSpaceAround">
            <Button
              style={{width: '40%'}}
              type="primary"
              onClick={async () => handleClaimRewards(record)}
            >
              提取收益&nbsp;&nbsp;&nbsp;
            </Button>
          </div>
        )
      }
    }
  ];
}
