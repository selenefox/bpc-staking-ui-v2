import {IValidator} from "@bpc/rc-javascript-sdk";
import {Button, Tooltip, Typography} from "antd";
import {ColumnProps} from "antd/lib/table";
import {BigNumber} from "bignumber.js";
import {delegate, undelegate, releaseFromJail} from "src/utils/helpers";
import React from 'react';

import {BasStore} from "../../../../stores/BasStore";
import prettyTime from "pretty-time";

const {Text} = Typography;

export const createTableColumns = (store: BasStore): ColumnProps<any>[] => {

  const handleDelegateClick = async (validator: IValidator) => {
    await delegate(store, validator.validator);
  }
  const handleUndelegateClick = async (validator: IValidator) => {
    await undelegate(store, validator.validator);
  }

  const handleReleaseClick = async (validator: IValidator) => {
    const {blockNumber, blockTime, epochBlockInterval, nextEpochBlock, epoch} = await store.getChainConfig();
    if (epoch < Number(validator.jailedBefore)) {
      const remainingBlocks = (Number(validator.jailedBefore) - epoch) * epochBlockInterval + (nextEpochBlock - blockNumber);
      const remainingTime = prettyTime(remainingBlocks * blockTime * 1000 * 1000 * 1000, 'm')
      return alert(`This validator can't be released right now, epoch ${validator.jailedBefore} is not reached. Current epoch is ${epoch}, you should wait for ${remainingTime}.`);
    }
    await releaseFromJail(store, validator.validator);
  }

  return [
    {
      title: '节点地址',
      dataIndex: 'validator',
      key: 'validator',
    },
    {
      title: '节点状态',
      key: 'status',
      render:(validator: IValidator) => {
        switch (validator.status) {
          case '0':
            return <Text type="secondary">未找到</Text>
          case '1':
            return <Text type="success">正常</Text>
          case '2':
            return <Text type="warning">等待</Text>
          case '4':
            return <Text>InActive</Text>
          case '3':
            return <Text type="danger">惩罚中 (e. {validator.jailedBefore})</Text>
          default:
            return <Text type="secondary">未知状态 (${validator.status})</Text>
        }
      }
    },
    {
      title: 'Slashes',
      dataIndex: 'slashesCount',
      key: 'slashesCount',
    },
    {
      title: '总质押量 (占比)',
      key: 'totalDelegated',
      render: (validator: IValidator) => `${(Number(validator.totalDelegated) / 1e18).toFixed(2)} (${validator.votingPower.toFixed(2)}%)`
    },
    {
      title: '节点佣金比例',
      dataIndex: 'commissionRate',
      key: 'commissionRate',
      render: (value: string) => `${(Number(value) / 1e2).toFixed(0)}%`
    },
    {
      title: 'APR',
      key: 'apr',
      render: (value: IValidator) => {
        const apr = 365 * (100 * new BigNumber(value.totalRewards).dividedBy(value.totalDelegated).toNumber())
        let prettyApr = '';
        if (apr === 0) {
          prettyApr = `0%`
        } else if (apr.toFixed(3) === '0.000') {
          prettyApr = `>0%`
        } else {
          prettyApr = `${apr.toFixed(3)}%`
        }
        const MyComponent = React.forwardRef((props, ref) => {
          return <div>{prettyApr}</div>
        });
        return (
          <Tooltip placement="left" title={apr}>
            <MyComponent/>
          </Tooltip>
        )
      }
    },

    {
      render: (validator: IValidator) => {
        const isJailed = validator.prettyStatus === 'JAILED';
        return (
          <>
            <Button
              className="tableButton"
              type="primary"
              onClick={async () => handleDelegateClick(validator)}
            >
              质押/委托
            </Button>

            <Button
              className="tableButton"
              type="default"
              onClick={async () => handleUndelegateClick(validator)}
            >
              解除质押
            </Button>

            {isJailed && (
              <Button
                className="tableButton"
                type="default"
                onClick={async () => handleReleaseClick(validator)}
                danger
              >
                撤销惩罚
              </Button>
            )}
          </>
        )
      }
    }
  ];
}
