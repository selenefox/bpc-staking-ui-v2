import { IValidator } from "@bpc/rc-javascript-sdk";
import { Table } from "antd";
import { observer } from "mobx-react";
import { BasStore } from "src/stores/BasStore";

import { LocalGridStore } from "src/stores/LocalGridStore";

import { createTableColumns } from "./columns";

export interface IValidatorTableProps {
  gridData:  LocalGridStore<IValidator>;
  store: BasStore;
}

const ValidatorTable = observer((props: IValidatorTableProps) => {
  // TODO: test
  console.log({props})
  return (
    <Table
      columns={createTableColumns(props.store)}
      dataSource={props.gridData.items}
      loading={props.gridData.isLoading}
      pagination={props.gridData.paginationConfig}
    />
  );
});

export default ValidatorTable
