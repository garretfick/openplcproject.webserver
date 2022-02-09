import React from 'react';
import { Protocol, devices } from './model/DeviceDefinitions';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    NumberInput,
    NumberInputField,
    Select,
    SimpleGrid,
    GridItem,
    Divider,
    Button,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ModbusDevice, RegisterDefinition } from './model/ModbusDevice';
import { createDevice, fetchPorts } from './api';
import { useQuery } from 'react-query';

const parities = [
    ['None', 'None'],
    ['Even', 'Even'],
    ['Odd', 'Odd'],
] as Option[];

interface TextControlDefinition {
    title: string;
    id: string;
    constValue?: string;
    value?: string;
    onChange: (value: string) => void;
}

function TextControl(def: TextControlDefinition) {
    const value = def.constValue || def.value || '';
    return (
        <FormControl isReadOnly={def.constValue !== undefined}>
            <FormLabel htmlFor={def.id}>
                {def.title + (def.constValue !== undefined ? ' (device-defined)' : '')}
            </FormLabel>
            <Input id={def.id} value={value} onChange={(event) => def.onChange(event.target.value)} />
        </FormControl>
    );
}

interface NumberControlDefinition {
    title: string;
    id: string;
    constValue?: number;
    value?: number;
    onChange: (value: number) => void;
}

function NumberControl(def: NumberControlDefinition) {
    const isConst = def.constValue !== undefined;
    const value = isConst ? def.constValue : def.value;
    const style = isConst ? { backgroundColor: 'grey' } : {};
    return (
        <FormControl isReadOnly={isConst}>
            <FormLabel htmlFor={def.id}>{def.title + (isConst ? ' (device-defined)' : '')}</FormLabel>
            <NumberInput max={50} min={0} value={value} onChange={(str, num) => def.onChange(num)} style={style}>
                <NumberInputField id={def.id} />
            </NumberInput>
        </FormControl>
    );
}

interface RegisterDefinitionProps {
    title: string;
    id: string;
    def: RegisterDefinition;
    onChange: (key: string, value: number) => void;
}

function RegistersControl(props: RegisterDefinitionProps) {
    return (
        <>
            <GridItem colSpan={2}>
                <FormLabel htmlFor={props.id + 'start'}>{props.title}</FormLabel>
            </GridItem>
            <GridItem>
                <NumberControl
                    title="Start Address"
                    id={props.id + 'start'}
                    onChange={props.onChange.bind(null, props.id + '.start')}
                />
            </GridItem>
            <GridItem>
                <NumberControl
                    title="Size"
                    id={props.id + 'size'}
                    onChange={props.onChange.bind(null, props.id + '.size')}
                />
            </GridItem>
            <GridItem colSpan={2}>
                <Divider />
            </GridItem>
        </>
    );
}

type Option = [string, string];

interface SelectDefinition {
    title: string;
    id: string;
    options: Option[];
    value: string | undefined;
    setter: (a: string) => void;
}

function SelectControl(def: SelectDefinition) {
    const options = def.options.map((item) => {
        return (
            <option value={item[0]} key={item[0]}>
                {item[1]}
            </option>
        );
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => def.setter(e.target.value);

    return (
        <FormControl>
            <FormLabel htmlFor={def.id}>{def.title}</FormLabel>
            <Select onChange={handleInputChange} defaultValue={def.value}>
                {options}
            </Select>
        </FormControl>
    );
}

export interface DeviceEditDialogProps {
    device: ModbusDevice;
    onClose: () => void;
}

function DeviceEditDialog(props: DeviceEditDialogProps) {
    const { status, data, error } = useQuery('ports', fetchPorts);
    const portOptions = (data?.map((item) => [item, item]) as Option[]) || [];

    const deviceTypes = devices.map((dev) => {
        return [dev.id, dev.name] as Option;
    });

    const [device, setDevice] = useState<ModbusDevice>(props.device);

    const setStringValue = (key: string, value: string) => {
        setDevice((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };
    const setNumberValue = (key: string, value: number) => {
        const idx = key.indexOf('.');
        if (idx < 0) {
            // This is a standard property - so set directly
            setDevice((prevState) => ({
                ...prevState,
                [key]: value,
            }));
        } else {
            // This is a nested property. We only have one level
            // of nesting, so get the current nested object, then
            // assign the new value and set into the parent.
            const prop = key.substring(0, idx);
            const subProp = key.substring(idx + 1);
            setDevice((prevState) => {
                const child = prevState[prop] as RegisterDefinition;
                const newChild = { ...child, [subProp]: value };

                return { ...prevState, [prop]: newChild };
            });
        }
    };

    const [deviceType, setDeviceType] = useState<string>(props.device.constraintId);

    const baseDevice = devices.find((item) => item.id === deviceType);
    if (!baseDevice) {
        return <></>;
    }

    const protocol =
        baseDevice.protocol === Protocol.RTU ? (
            <>
                <GridItem>
                    <SelectControl
                        title="COM Port"
                        id="com_port"
                        options={portOptions}
                        value={device.commPort}
                        setter={setStringValue.bind(null, 'commPort')}
                    />
                </GridItem>
                <GridItem>
                    <NumberControl
                        title="Baud Rate"
                        id="baud_rate"
                        constValue={baseDevice.baudRate}
                        value={device.baudRate}
                        onChange={setNumberValue.bind(null, 'baudRate')}
                    />
                </GridItem>
                <GridItem>
                    <SelectControl
                        title="Parity"
                        id="parity"
                        options={parities}
                        value={device.parity}
                        setter={setStringValue.bind(null, 'parity')}
                    />
                </GridItem>
                <GridItem>
                    <NumberControl
                        title="Data Bits"
                        id="data_bits"
                        constValue={baseDevice.dataBits}
                        value={device.dataBits}
                        onChange={setNumberValue.bind(null, 'dataBits')}
                    />
                </GridItem>
                <GridItem>
                    <NumberControl
                        title="Stop Bits"
                        id="stop_bits"
                        constValue={baseDevice.stopBits}
                        value={device.stopBits}
                        onChange={setNumberValue.bind(null, 'stopBits')}
                    />
                </GridItem>
            </>
        ) : (
            <>
                <GridItem>
                    <TextControl
                        title="IP Address"
                        id="ip_address"
                        constValue={undefined}
                        value={device.address}
                        onChange={setStringValue.bind(null, 'address')}
                    />
                </GridItem>
                <GridItem>
                    <NumberControl
                        title="IP Port"
                        id="ip_port"
                        constValue={undefined}
                        value={device.port}
                        onChange={setNumberValue.bind(null, 'port')}
                    />
                </GridItem>
            </>
        );

    const onApply = () => {
        // Gather the data we have to ask whether this is a valid device according
        // to the constraints
        createDevice(device);

        props.onClose();
    };

    // If we don't have an ID for the editing device, then we
    // are creating a new device.
    const isNewDevice = !device.id;

    return (
        <Modal
            isOpen={true}
            onClose={() => props.onClose()}
            size="lg"
            closeOnOverlayClick={false}
            scrollBehavior="inside"
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{isNewDevice ? 'New Connected Device' : 'Edit ' + device.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <SimpleGrid columns={2} columnGap={2} rowGap={2} width="full">
                        <GridItem colSpan={2}>Input connection information for the remote device.</GridItem>

                        <GridItem>
                            <TextControl
                                title="Device Name"
                                id="dev_name"
                                constValue={undefined}
                                value={device.name}
                                onChange={setStringValue.bind(null, 'name')}
                            />
                        </GridItem>
                        <GridItem></GridItem>

                        <GridItem>
                            <SelectControl
                                title="Device Type"
                                id="dev_type"
                                options={deviceTypes}
                                value={device.constraintId}
                                setter={setDeviceType}
                            />
                        </GridItem>
                        <GridItem>
                            <NumberControl
                                title="Slave ID"
                                id="slave_id"
                                constValue={baseDevice.slaveId}
                                value={device.slaveId}
                                onChange={setNumberValue.bind(null, 'slaveId')}
                            />
                        </GridItem>

                        <GridItem colSpan={2}>
                            <Divider />
                        </GridItem>

                        {protocol}
                        <GridItem colSpan={2}>
                            <Divider />
                        </GridItem>

                        <RegistersControl
                            title="Discrete Inputs (%IX100.0)"
                            id="di"
                            def={baseDevice.di}
                            onChange={setNumberValue}
                        />
                        <RegistersControl
                            title="Coils (%QX100.0)"
                            id="do"
                            def={baseDevice.do}
                            onChange={setNumberValue}
                        />
                        <RegistersControl
                            title="Input Registers (%IW100)"
                            id="ai"
                            def={baseDevice.ai}
                            onChange={setNumberValue}
                        />
                        <RegistersControl
                            title="Holding Registers - Read (%IW100)"
                            id="aor"
                            def={baseDevice.aor}
                            onChange={setNumberValue}
                        />
                        <RegistersControl
                            title="Holding Registers - Write (%QW100)"
                            id="aow"
                            def={baseDevice.aow}
                            onChange={setNumberValue}
                        />
                    </SimpleGrid>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={() => props.onClose()}>
                        Close
                    </Button>
                    <Button variant="ghost" onClick={onApply}>
                        Apply
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default DeviceEditDialog;
