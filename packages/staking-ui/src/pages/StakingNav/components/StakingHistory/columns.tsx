import { Typography } from "antd";
import { ColumnProps } from "antd/lib/table";

import { BasStore } from "src/stores/BasStore";

import { IHistoryData } from "./interface";

const {Link} = Typography;

export const createTableColumns = (store: BasStore): ColumnProps<any>[] => {
  const columns: any[] = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
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
  ];
  if (store.config.explorerConfig) {
    columns.push({
      title: '区块号',
      render: (record: IHistoryData) => {
        const url = store.config.explorerConfig?.blockUrl.replace('{block}', `${record.event?.blockNumber || 0}`)
        return (
          <Link href={url} target="_blank">
            {record.event?.blockNumber || 0}
          </Link>
        )
      }
    })
    columns.push({
      title: '交易Hash',
      render: (record: IHistoryData) => {
        const url = store.config.explorerConfig?.txUrl.replace('{tx}', record.transactionHash)
        return (
          <Link href={url} target="_blank">

            {record.transactionHash.substring(0, 10)}...{record.transactionHash.substring(58)}
          </Link>
        )
      }
    })
  }
  return columns
}
