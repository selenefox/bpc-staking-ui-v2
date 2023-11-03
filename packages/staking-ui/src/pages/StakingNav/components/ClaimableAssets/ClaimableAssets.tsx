import { IStakingRewards } from "@bpc/rc-javascript-sdk";
import {Table, Typography} from "antd";
import {observer} from "mobx-react";

import {useBasStore} from "src/stores";
import {useLocalGridStore} from "src/stores/LocalGridStore";

import {createTableColumns} from "./columns";

const ClaimableAssets = observer(() => {
  const store = useBasStore()
  const grid = useLocalGridStore<IStakingRewards>(async (offset: number, limit: number): Promise<[IStakingRewards[], boolean]> => {
    const result = await store.getBasSdk().getStaking().getMyClaimableStakingRewards();
    return [result, false]
  });

  return (
    <>
      <Typography.Title>Claimable Assets</Typography.Title>
      <Table
        columns={createTableColumns(store)}
        dataSource={grid.items}
        loading={grid.isLoading}
        pagination={grid.paginationConfig}
      />
    </>
  );
});

export default ClaimableAssets;