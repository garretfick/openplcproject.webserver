import React from 'react';
import { useQuery } from 'react-query';
import { fetchModbusDevices } from './api';
import { Table, Thead, Tbody, Tr, Th, Td, Divider, Button } from '@chakra-ui/react';
import DeviceEditDialog from './DeviceEditDialog';
import { useState } from 'react';
import ActionButton from './ActionButton';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { ModbusDevice } from './model/ModbusDevice';
import QueryStatus from './QueryStatus';

const newDefaultDevice = () => {
    return {
        constraintId: 'Mega',
    } as ModbusDevice;
};

function ModbusDevices() {
    const result = useQuery('devices', fetchModbusDevices);
    const { data } = result;

    // When non-null, we are editing a device.
    const [editDevice, setEditDevice] = useState<null | ModbusDevice>(null);

    // TODO
    const onDeleteHandler = (itemId: string) => 1;

    const onEditHandler = (itemId: string) => {
        // TODO need to make this edit the right item
        const item = data?.find((item) => item.name === itemId);
        const dev = {} as ModbusDevice;
        setEditDevice(dev);
    };

    const devices = data?.map((item) => {
        return (
            <Tr key={item.name}>
                <Td>{item.name}</Td>
                <Td>{item.type}</Td>
                <Td>{item.di?.start}</Td>
                <Td>{item.do?.start}</Td>
                <Td>{item.ai?.start}</Td>
                <Td>{item.aor?.start}</Td>
                <Td>{item.aow?.start}</Td>
                <Td>
                    <ActionButton
                        icon={<EditIcon />}
                        actionName="Edit "
                        itemName={item.name}
                        itemId={item.name}
                        action={onEditHandler}
                    />
                    <ActionButton
                        icon={<DeleteIcon />}
                        actionName="Delete "
                        itemName={item.name}
                        itemId={item.name}
                        action={onDeleteHandler}
                    />
                </Td>
            </Tr>
        );
    });

    return (
        <>
            <Button leftIcon={<AddIcon />} onClick={() => setEditDevice(newDefaultDevice())}>
                New Device
            </Button>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Device Name</Th>
                        <Th>Device Type</Th>
                        <Th>DI</Th>
                        <Th>DO</Th>
                        <Th>AI</Th>
                        <Th>AO</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>{devices}</Tbody>
            </Table>
            <Divider />
            <QueryStatus result={result} />
            {editDevice && <DeviceEditDialog device={editDevice} onClose={() => setEditDevice(null)} />}
        </>
    );
}

export default ModbusDevices;
