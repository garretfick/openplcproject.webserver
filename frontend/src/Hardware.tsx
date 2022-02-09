import React, { useState } from 'react';
import './App.css';
import { useQuery } from 'react-query';
import { fetchDrivers, fetchCustomDriver, Drivers } from './api';
import { Box, Button, Divider, Flex, Heading, Select, Text, Textarea } from '@chakra-ui/react';
import CodeEditor from '@uiw/react-textarea-code-editor';

interface HardwareLayerControlProps {
    drivers: Drivers;
}

function HardwareLayerControl(props: HardwareLayerControlProps) {
    const [driver, setDriver] = useState<string>(props.drivers.selected);

    const options = props.drivers.items.map((item) => {
        return (
            <option value={item.id} key={item.id}>
                {item.name}
            </option>
        );
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => setDriver(e.target.value);
    // TODO
    const onApply = () => setDriver('');

    return (
        <Flex as="div" align="center" justify="space-between" w="full" px="4" h="14">
            <Select display={{ base: 'none', md: 'flex' }} onChange={handleInputChange} defaultValue={driver}>
                {options}
            </Select>
            <Flex align="center">
                <Button colorScheme="blue" mr={3} onClick={onApply}>
                    Apply
                </Button>
            </Flex>
        </Flex>
    );
}

function HardwareLayer() {
    const { status, data, error } = useQuery('hardware', fetchDrivers);

    if (!data) {
        return <></>;
    }

    return (
        <>
            <Heading as="h2">Hardware Driver</Heading>
            <Text>Choose the hardware driver that represents the execution environment for your application.</Text>
            <Text>
                The hardware driver maps inputs and outputs (I/O) from the execution environment into the PLC
                application. Mapped I/O are accessible as variables in the PLC application.
            </Text>
            <HardwareLayerControl drivers={data} />
        </>
    );
}

interface CustomDriverControlProps {
    data: string;
}

function CustomDriverControl(props: CustomDriverControlProps) {
    const [code, setCode] = useState<string>(props.data);

    return (
        <Box w="100%" mt={4} mb={4} color="white" height="300px" overflow="auto">
            <CodeEditor
                value={code}
                language="c"
                minHeight={300}
                onChange={(evn) => setCode(evn.target.value)}
                padding={15}
                style={{
                    fontSize: 12,
                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                    backgroundColor: 'white',
                    color: 'black',
                }}
            />
        </Box>
    );
}

function CustomDriver() {
    const { status, data, error } = useQuery('customHardware', fetchCustomDriver);

    if (status === 'loading') {
        return <span>Loading...</span>;
    }

    if (status === 'error') {
        return <span>Error: {error}</span>;
    }

    // TODO
    const onApply = () => 1;
    const onReset = () => 2;

    return (
        <>
            <Heading as="h2">Hardware Layer Code Box</Heading>
            <Text>
                The Hardware Layer Code Box allows you to extend the functionality of the current driver by adding
                custom code to it, such as reading I2C, SPI and 1-Wire sensors, or controlling port expanders to add
                more outputs to your hardware.
            </Text>
            <CustomDriverControl data={(data && data.data) || ''} />

            <Button colorScheme="blue" onClick={onApply}>
                Apply
            </Button>
            <Button onClick={onReset}>Reset to Default</Button>
        </>
    );
}

function Hardware() {
    return (
        <>
            <HardwareLayer />
            <Divider />
            <CustomDriver />
        </>
    );
}

export default Hardware;
