import {Col, Row, Typography} from "antd";
import {observer} from "mobx-react";
import {useEffect, useState} from "react";
import {useBasStore} from "src/stores";
import {IChainConfig, IChainParams} from "@bpc/rc-javascript-sdk";
import prettyTime from "pretty-time";

type IBlockInfoData = IChainConfig & IChainParams;

const {Text} = Typography;

const BlockInfo = observer(
    () => {
  const store = useBasStore();

  const [blockInfo, setBlockInfo] = useState<IBlockInfoData | null>(null);
  useEffect(() => {
    setInterval(async () => {
      if (!store.isConnected) return;
      setBlockInfo(await store.getChainConfig());
    }, 3_000)
  }, [store]);
  const SPAN = 6;
  if (!blockInfo) {
    return (
      <div className="blockInfo">
        <br/>
        <div className="blockInfoData">
          <h3 style={{marginTop: '25px', marginBottom: '25px'}}>Loading...</h3>
        </div>
      </div>
    )
  }
  return (
    <div className="blockInfo">
      <br/>
      <Row className="blockInfoData">
        <Col className="blockInfoItem" span={SPAN}>
          <Row>
            <Text strong style={{marginRight: '2px'}}>最新区块:</Text>
            <Text>{blockInfo.blockNumber}</Text>
          </Row>
          <Row>
            <Text strong style={{marginRight: '2px'}}>权益周期:</Text>
            <Text>{blockInfo.epoch}</Text>
          </Row>
          <Row>
            <Text strong style={{marginRight: '2px'}}>下一个周期块号:</Text>
            <Text>
              {blockInfo.nextEpochBlock}
              &nbsp;(in {blockInfo.nextEpochIn})
            </Text>
          </Row>
          <Row>
            <Text strong style={{marginRight: '2px'}}>出块速度:</Text>
            <Text>{blockInfo.blockTime}</Text>
            <Text>&nbsp;sec.</Text>
          </Row>
        </Col>

        <Col className="blockInfoItem" span={SPAN}>
          <Row>
            <Text strong style={{marginRight: '2px'}}>超级节点总数:</Text>
            <Text>{blockInfo.activeValidatorsLength}</Text>
          </Row>
          <Row>
            <Text strong style={{marginRight: '2px'}}>权益计算周期:</Text>
            <Text>{blockInfo.epochBlockInterval}</Text>
            <Text>&nbsp;({prettyTime(blockInfo.epochBlockInterval * blockInfo.blockTime * 1e9, 'm')})</Text>
          </Row>
          <Row>
            <Text strong style={{marginRight: '2px'}}>节点失效记录:</Text>
            <Text>{blockInfo.misdemeanorThreshold}</Text>
            <Text>&nbsp;({prettyTime(blockInfo.misdemeanorThreshold * blockInfo.activeValidatorsLength * blockInfo.blockTime * 1e9, 'm')})</Text>
          </Row>
          <Row>
            <Text strong style={{marginRight: '2px'}}>节点失效惩罚周期:</Text>
            <Text>{blockInfo.felonyThreshold}</Text>
            <Text>&nbsp;({prettyTime(blockInfo.felonyThreshold * blockInfo.activeValidatorsLength * blockInfo.blockTime * 1e9, 'm')})</Text>
          </Row>

        </Col>

        <Col className="blockInfoItem" span={SPAN}>
          <Row>
            <Text strong style={{marginRight: '2px'}}>失效节点惩罚时常:</Text>
            <Text>{blockInfo.validatorJailEpochLength}</Text>
            <Text>&nbsp;({prettyTime(blockInfo.validatorJailEpochLength * blockInfo.epochBlockInterval * blockInfo.blockTime * 1e9, 'm')})</Text>
          </Row>
          <Row>
            <Text strong style={{marginRight: '2px'}}>解除质押冻结时长:</Text>
            <Text>{blockInfo.undelegatePeriod}</Text>
            <Text>&nbsp;({prettyTime(blockInfo.undelegatePeriod * blockInfo.epochBlockInterval * blockInfo.blockTime * 1e9, 'm')})</Text>
          </Row>
          <Row>
            <Text strong style={{marginRight: '2px'}}>节点最少质押量:</Text>
            <Text>{blockInfo.minValidatorStakeAmount.toString(10)}</Text>
          </Row>
          <Row>
            <Text strong style={{marginRight: '2px'}}>用户最少质押金额:</Text>
            <Text>{blockInfo.minStakingAmount.toString(10)}</Text>
          </Row>
        </Col>
      </Row>
    </div>
  )
});

export default BlockInfo;