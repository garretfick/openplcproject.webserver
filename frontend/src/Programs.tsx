import React, { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, IconButton, Divider, Button } from '@chakra-ui/react';
import { AddIcon, DeleteIcon, RepeatIcon } from '@chakra-ui/icons';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { fetchPrograms, deleteProgram, compileProgram, createProgram } from './api';
import ActionButton from './ActionButton';
import ProgramUploadControl from './ProgramUploadControl';
import QueryStatus from './QueryStatus';
import DeleteButton from './DeleteButton';

function Programs() {
    const queryClient = useQueryClient();
    const result = useQuery('programs', fetchPrograms);
    const { data } = result;
    const mutation = useMutation(createProgram, {
        onSuccess: () => {
            queryClient.invalidateQueries('programs');
        },
    });
    const [upload, setUpload] = useState(false);

    const handleDelete = (programId: string) => {
        if (programId) {
            deleteProgram(programId);
        }
    };

    const handleCompile = (programId: string) => {
        if (programId) {
            compileProgram(programId);
        }
    };

    const programs = data?.map((item) => {
        return (
            <Tr key={item.id}>
                <Td>{item.name}</Td>
                <Td>{item.fileName}</Td>
                <Td isNumeric>{item.createdAt.toLocaleString()}</Td>
                <Td>
                    <ActionButton
                        icon={<RepeatIcon />}
                        actionName="Compile "
                        itemName={item.name}
                        itemId={item.id}
                        action={handleCompile}
                    />
                    <DeleteButton
                        itemName={item.name}
                        itemId={item.id}
                        confirmTitle="Delete program"
                        confirmText="Are you sure you want to delete?"
                        onDelete={handleDelete}
                    />
                </Td>
            </Tr>
        );
    });

    return (
        <>
            <Button leftIcon={<AddIcon />} onClick={() => setUpload(true)}>
                Upload Program
            </Button>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Program Name</Th>
                        <Th>File</Th>
                        <Th isNumeric>Created</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>{programs}</Tbody>
            </Table>
            <Divider />
            <QueryStatus result={result} />
            {upload && (
                <ProgramUploadControl onClose={() => setUpload(false)} onAccept={(data) => mutation.mutate(data)} />
            )}
        </>
    );
}

export default Programs;
