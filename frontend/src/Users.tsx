import React from 'react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { Button, Divider, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import ActionButton from './ActionButton';
import { deleteUser, fetchUsers } from './api';
import { User } from './model/User';
import UserEditDialog from './UserEditDialog';
import QueryStatus from './QueryStatus';
import DeleteButton from './DeleteButton';

const newDefaultUser = () => {
    return {
        name: '',
        username: '',
        email: '',
        password: '',
    } as User;
};

function Users() {
    const queryClient = useQueryClient();
    const result = useQuery('users', fetchUsers);
    const { data } = result;

    // When non-null, we are editing a user.
    const [editUser, setEditUser] = useState<null | User>(null);

    const handleEdit = (username: string) => {
        const user = data?.find((item) => item.username === username);
        setEditUser(user || null);
    };
    const handleDelete = (user_id: string) => {
        queryClient.invalidateQueries('users');
        deleteUser(user_id);
    };
    const handleEditDone = () => {
        queryClient.invalidateQueries('users');
        setEditUser(null);
    };

    const users = data?.map((item) => {
        return (
            <Tr key={item.username}>
                <Td>{item.name}</Td>
                <Td>{item.username}</Td>
                <Td>{item.email}</Td>
                <Td>
                    <ActionButton
                        icon={<EditIcon />}
                        actionName="Edit "
                        itemName={item.username}
                        itemId={item.username}
                        action={handleEdit}
                    />
                    <DeleteButton
                        itemName={item.username}
                        itemId={item.user_id.toString()}
                        confirmTitle="Delete User"
                        confirmText="Are you sure you want to delete?"
                        onDelete={handleDelete}
                    />
                </Td>
            </Tr>
        );
    });
    return (
        <>
            <Button leftIcon={<AddIcon />} onClick={() => setEditUser(newDefaultUser())}>
                New User
            </Button>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Full Name</Th>
                        <Th>Username</Th>
                        <Th>Email</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>{users}</Tbody>
            </Table>
            <Divider />
            <QueryStatus result={result} />
            {editUser && (
                <UserEditDialog isCreate={editUser.username === ''} user={editUser} onClose={handleEditDone} />
            )}
        </>
    );
}

export default Users;
