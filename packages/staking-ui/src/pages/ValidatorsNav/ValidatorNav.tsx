/* eslint-disable no-await-in-loop */
import {IValidator, Web3Uint256} from "@bpc/rc-javascript-sdk";
import {observer} from "mobx-react";
import {ReactElement, useState, useEffect} from "react";
import ValidatorTable from "src/pages/ValidatorsNav/components/ValidatorTable/ValidatorTable";
import {useBasStore} from "src/stores";
import {useLocalGridStore} from "src/stores/LocalGridStore";

import '../index.css';

import {BondedTokensCard} from "./components/BondedTokensCard";
import {ValidatorsCard} from "./components/ValidatorsCard";
import {Button, Divider, Drawer} from "antd";
import CreateProposalForm from "../GovernanceNav/components/CreateProposalForm/CreateProposalForm";
import RegisterValidatorForm from "./components/RegisterValidatorForm/RegisterValidatorForm";
import {PlusOutlined} from "@ant-design/icons";

interface IValidatorWithAmounts extends IValidator {
    key: string;
}

export const ValidatorsNav = observer((): ReactElement => {
    const [activeValidators, setActiveValidators] = useState(0);
    const [totalValidators, setTotalValidators] = useState(0);
    const [bondedTokens, setBondedTokens] = useState('');
    const [registerValidatorVisible, setRegisterValidatorVisible] = useState(false)

    const store = useBasStore();
    const grid = useLocalGridStore<IValidator>(async (offset: number, limit: number): Promise<[IValidatorWithAmounts[], boolean]> => {
        const validators = await store.getBasSdk().getStaking().getAllValidators();
        const chainConfig = (await store.getChainConfig()).candidateLength;
        const tOPAddress = await store.getBasSdk().getStaking().getActiveValidatorsAddresses();
        const totalDelegatedTokens = await store.getBasSdk().getStaking().getTotalDelegatedAmount();
        setBondedTokens(totalDelegatedTokens.toFixed(4));
        const result: IValidatorWithAmounts[] = [];
        let activeCount = 0;
        validators.forEach(validator => {
            if (validator.status === '1') {
                let isActive = false;
                tOPAddress.forEach(address => {
                    if (address.toLowerCase() === validator.validator.toLowerCase()) {
                        isActive = true;
                    }
                });
                if (!isActive) {
                    validator.prettyStatus = 'INACTIVE';
                    validator.status = '4';
                }
            }
        });
        // eslint-disable-next-line no-restricted-syntax
        for (const validator of validators) {
            if (validator.status === '1') {
                activeCount += 1;
            }
            result.push({
                ...validator,
                key: validator.validator,
            });
        }
        setTotalValidators(chainConfig);
        setActiveValidators(activeCount);
        return [result, false]
    });

    useEffect(() => {

    }, [store]);

    return (
        <div>
            <div className="validatorHeadWrapper">
                <ValidatorsCard
                    active={activeValidators}
                    loading={grid.isLoading}
                    title="Validators"
                    total={totalValidators}
                  />

                <BondedTokensCard
                    loading={grid.isLoading}
                    title="Bonded Tokens"
                    tokens={bondedTokens}
                    tokenSymbol="RC"
                />
            </div>
            <br/>

            <ValidatorTable gridData={grid} store={store}/>
            <Divider/>
            <Drawer
                bodyStyle={{paddingBottom: 80}}
                title="Register new validator"
                visible={registerValidatorVisible}
                width={500}
                onClose={() => {
                    setRegisterValidatorVisible(false);
                }}
            >
                <RegisterValidatorForm/>
            </Drawer>
            <Button icon={<PlusOutlined translate="yes"/>} size="large" type="primary"
                    onClick={() => setRegisterValidatorVisible(true)}>Register New Validator</Button>
            <br/>
            <br/>
            <br/>
        </div>
    );
})