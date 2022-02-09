import React from 'react';
import { EditIcon } from '@chakra-ui/icons';
import { Table, Thead, Tbody, Tr, Th, Td, useDisclosure, Divider } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import ActionButton from './ActionButton';
import { fetchVariables } from './api';
import VariableEditDialog from './VariableEditDialog';
import QueryStatus from './QueryStatus';

function Monitoring() {
    // TODO add refresh rate option
    const result = useQuery('monitoring', fetchVariables);
    const { data } = result;
    const [editItemId, setEditItemId] = React.useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onEdit = (itemName: string) => {
        setEditItemId(itemName);
        onOpen();
    };

    const editItem = data?.find((item) => item.name === editItemId);

    const variables = data?.map((item) => {
        return (
            <Tr key={item.name}>
                <Td>{item.name}</Td>
                <Td>{item.typeName}</Td>
                <Td>{item.location}</Td>
                <Td>{item.forced}</Td>
                <Td isNumeric>{item.value}</Td>
                <Td>
                    <ActionButton
                        icon={<EditIcon />}
                        actionName="Edit "
                        itemName={item.name}
                        itemId={item.name}
                        action={onEdit}
                    />
                </Td>
            </Tr>
        );
    });

    return (
        <>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Point Name</Th>
                        <Th>Type</Th>
                        <Th>Location</Th>
                        <Th>Forced</Th>
                        <Th isNumeric>Value</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>{variables}</Tbody>
            </Table>
            <Divider />
            <QueryStatus result={result} />
            {editItem && (
                <VariableEditDialog
                    item={editItem}
                    onClose={() => {
                        setEditItemId('');
                    }}
                />
            )}
        </>
    );
}

export default Monitoring;
