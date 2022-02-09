import React from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react';
import { useState } from 'react';
import { createUser } from './api';
import { User } from './model/User';
import FileControl from './FileControl';

export interface UserEditDialogProps {
    isCreate: boolean;
    user: User;
    onClose: () => void;
}

function UserEditDialog(props: UserEditDialogProps) {
    const [user, setUser] = useState<User>(props.user);
    const [showPassword, setShowPassword] = useState(false);

    const onApply = () => {
        // Gather the data we have to ask whether this is a valid device according
        // to the constraints
        createUser(user);

        props.onClose();
    };

    const setStringValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        const key = event.target.id;
        const value = event.target.value;
        setUser((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const onToggleShowPassword = () => setShowPassword(!showPassword);
    const onFileSelected = (data: { filename: string; data: string }) => {
        console.log(data);
    };

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
                <ModalHeader>{props.isCreate ? 'New User' : 'Edit ' + user.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel htmlFor="name">Full Name</FormLabel>
                        <Input id="name" value={user.name} onChange={setStringValue} />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <Input id="username" value={user.username} onChange={setStringValue} />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input id="email" value={user.email} onChange={setStringValue} />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <InputGroup>
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={user.password}
                                onChange={setStringValue}
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={onToggleShowPassword}>
                                    {showPassword ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="password">Picture</FormLabel>
                        <FileControl accept="image/*" description="" onSelected={onFileSelected} />
                    </FormControl>
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

export default UserEditDialog;
