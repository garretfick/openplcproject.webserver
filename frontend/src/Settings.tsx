import { Button, Checkbox, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { fetchSettings, fetchUsers } from './api';
import { RuntimeSettings } from './model/RuntimeSettings';

interface FeatureProps {
    enabledId: string;
    valueId: string;

    enabled: boolean;
    value: number;

    onChange: (field: string, value: boolean | number | string) => void;

    featureName: string;
    configValueName: string;
}

function Feature(props: FeatureProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        props.onChange(name, value);
    };

    return (
        <>
            <FormControl>
                <Checkbox id={props.enabledId} isChecked={props.enabled} onChange={handleChange}>
                    {props.featureName}
                </Checkbox>
            </FormControl>
            <FormControl marginBottom={6}>
                <FormLabel htmlFor={props.valueId}>{props.configValueName}</FormLabel>
                <Input type="number" id={props.valueId} value={props.value} width="sm" onChange={handleChange} />
            </FormControl>
        </>
    );
}

interface SettingsFormProps {
    initialSettings: RuntimeSettings;
}

function SettingsForm(props: SettingsFormProps) {
    const [fields, setFields] = useState({ ...props.initialSettings });

    const handleChange = (name: string, value: boolean | number | string) => {
        setFields({ ...fields, [name]: value });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFields({ ...fields, [name]: value });
    };

    return (
        <>
            <Heading as="h2">Features</Heading>
            <Feature
                enabledId="modbusEnabled"
                valueId="modbusPort"
                enabled={fields.modbusEnabled}
                value={fields.modbusPort}
                onChange={handleChange}
                featureName="Enable Modbus Server"
                configValueName="Modbus Server Port"
            />
            <Feature
                enabledId="dnp3Enabled"
                valueId="dnp3Port"
                enabled={fields.dnp3Enabled}
                value={fields.dnp3Port}
                onChange={handleChange}
                featureName="Enable DNP3 Server"
                configValueName="DNP3 Server Port"
            />
            <Feature
                enabledId="enipEnabled"
                valueId="enipPort"
                enabled={fields.enipEnabled}
                value={fields.enipPort}
                onChange={handleChange}
                featureName="Enable EtherNet/IP Server"
                configValueName="EtherNet/IP Server Port"
            />
            <Feature
                enabledId="storageEnabled"
                valueId="storagePeriod"
                enabled={fields.storageEnabled}
                value={fields.storagePeriod}
                onChange={handleChange}
                featureName="Enable Persistent Storage"
                configValueName="Persistent Storage Polling Rate"
            />
            <Checkbox id="startInRun" isChecked={fields.startInRun} onChange={handleInputChange}>
                Start In Run Mode
            </Checkbox>

            <Heading as="h2">Slave Devices</Heading>
            <FormControl marginBottom={6}>
                <FormLabel htmlFor="poll">Poll Period (ms)</FormLabel>
                <Input
                    type="number"
                    id="pollPeriod"
                    value={fields.pollPeriod}
                    width="sm"
                    onChange={handleInputChange}
                />
            </FormControl>

            <FormControl marginBottom={6}>
                <FormLabel htmlFor="timeout">Timeout (ms)</FormLabel>
                <Input type="number" id="timeout" value={fields.timeout} width="sm" onChange={handleInputChange} />
            </FormControl>

            <Heading as="h2">Monitoring</Heading>

            <FormControl marginBottom={6}>
                <FormLabel htmlFor="refresh">Monitoring Refresh Rate (ms)</FormLabel>
                <Input
                    type="number"
                    id="refreshPeriod"
                    value={fields.refreshPeriod}
                    width="sm"
                    onChange={handleInputChange}
                />
            </FormControl>
            <Button>Save</Button>
        </>
    );
}

function Settings() {
    const result = useQuery('settings', fetchSettings);
    const { data } = result;

    if (!data) {
        return <></>;
    }

    return (
        <>
            <SettingsForm initialSettings={data} />
        </>
    );
}

export default Settings;
