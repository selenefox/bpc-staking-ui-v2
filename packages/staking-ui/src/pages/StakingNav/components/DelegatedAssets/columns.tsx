import { Button } from "antd";
import { ColumnProps } from "antd/lib/table";
import { BasStore } from "src/stores/BasStore";
import { undelegate, delegate } from "src/utils/helpers";

import { IDelegatedAssetsData } from "./interface";

export const createTableColumns = (store: BasStore): ColumnProps<any>[]  => {
  
  const handleCancelDelegateClick = async (record: IDelegatedAssetsData) => {
    await undelegate(store, record.validator);
  }

  const handleRepeatDelegateClick = async (record: IDelegatedAssetsData) => {
    await delegate(store, record.validator);
  }
  
  return [
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '超级节点',
      dataIndex: 'validator',
      key: 'validator',
    },
    {
      title: '操作',
      render: (record: IDelegatedAssetsData) => {
        return (
          <div className="flexSpaceAround">
            <Button
              style={{ width: '40%' }}
              type="primary" 
              onClick={async () => handleCancelDelegateClick(record)}
            >
              取消
            </Button>
            <Button
              style={{ width: '40%' }}
              type="primary" 
              onClick={async () => handleRepeatDelegateClick(record)}
            >
              重复
            </Button>
          </div>
        )
      }
    }
  ];
}
