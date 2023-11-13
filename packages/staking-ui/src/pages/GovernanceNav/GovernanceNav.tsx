import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import { observer } from "mobx-react";
import { ReactElement, useState } from "react";

import '../index.css';

import CreateProposalForm from "./components/CreateProposalForm/CreateProposalForm";
import ProposalTable from "./components/ProposalTable/ProposalTable";


export const GovernanceNav = observer((): ReactElement => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  return (
    <div>
      <Drawer
        bodyStyle={{paddingBottom: 80}}
        title="创建提案"
        visible={drawerVisible}
        width={500}
        onClose={() => {
          setDrawerVisible(false)
        }}
      >
        <CreateProposalForm />
      </Drawer>
      
      <ProposalTable />

      <Button 
        icon={<PlusOutlined translate="yes"/>} 
        size="large" 
        style={{ margin: 10 }}
        type="primary" 
        onClick={() => {
          setDrawerVisible(true)
        }}
      >
          创建提案
      </Button>
    </div>
  );
})