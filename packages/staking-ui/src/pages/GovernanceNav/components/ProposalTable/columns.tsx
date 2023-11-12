import {IGovernanceProposal, TGovernanceProposalStatus} from "@bpc/rc-javascript-sdk";
import {Button, Tag} from "antd";
import {ColumnProps} from "antd/lib/table";
import {ReactElement} from "react";

import {BasStore} from "src/stores/BasStore";
import {BigNumber} from "bignumber.js";

export const renderStatus = (status: TGovernanceProposalStatus): ReactElement => {
  const colors: Record<string, string> = {
    Pending: 'grey',
    Active: 'blue',
    Canceled: 'grey',
    Defeated: 'orange',
    Succeeded: 'blue',
    Queued: 'yellow',
    Expired: 'red',
    Executed: 'green'
  };
  return <Tag key={status} color={colors[status.toString()] || 'grey'}>{status}</Tag>
};

export const createTableColumns = (store: BasStore): ColumnProps<any>[] => {
  return [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      render: (value: string) => `${value.substr(0, 20)}...`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: renderStatus,
    },
    {
      title: '所需人数',
      key: 'quorumRequired',
      dataIndex: 'quorumRequired',
      render: (value: BigNumber) => value.toFixed(0),
    },
    {
      title: '投票结果',
      key: 'blockNumber',
      render: (value: IGovernanceProposal) => {
        return (
          <div>
            <span style={{color: 'green', fontWeight: 500}}>{value.voteDistribution.FOR.dividedBy(value.totalPower).multipliedBy(100).toFixed(4)}%</span>
            &nbsp;
            /
            &nbsp;
            <span style={{color: 'red', fontWeight: 500}}>{value.voteDistribution.AGAINST.dividedBy(value.totalPower).multipliedBy(100).toFixed(4)}%</span>
          </div>
        )
      }
    },
    {
      title: '投票有效期',
      key: 'votingPeriod',
      render: ({startBlock, endBlock}: any) => {
        return `${startBlock} -> ${endBlock}`
      }
    },
    {
      title: '提案描述',
      dataIndex: 'desc',
      key: 'desc',
      render: (description: string) => description.length > 30 ? `${description.slice(0, 30)}...` : description,
    },
    {
      render: (event: IGovernanceProposal) => {
        if (`${event.status}` === 'Active') {
          return (
            <Button.Group>
              <Button
                type="primary"
                onClick={async () => {
                  const {transactionHash, receipt} = await store.getBasSdk().getGovernance().voteForProposal(event.id);
                  console.log(transactionHash);
                  console.log(await receipt);
                }}
              >
                投票同意
              </Button>

              <Button
                onClick={async () => {
                  const {
                    transactionHash,
                    receipt
                  } = await store.getBasSdk().getGovernance().voteAgainstProposal(event.id);
                  console.log(transactionHash);
                  console.log(await receipt);
                }}
              >
                投票反对
              </Button>
            </Button.Group>
          )
        }
        if (`${event.status}` === 'Succeeded' || `${event.status}` === 'Queued') {
          return (
            <Button.Group>
              <Button type="primary" onClick={async () => {
                const {transactionHash, receipt} = await store.getBasSdk().getGovernance().executeProposal(event)
                console.log(transactionHash)
                console.log(await receipt)
              }}>执行提案</Button>
            </Button.Group>
          )
        }
      }
    }
  ];
}
