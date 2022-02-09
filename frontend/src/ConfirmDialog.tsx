import { Variable } from './model/Variable';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Text,
    Code,
} from '@chakra-ui/react';
import React from 'react';

export interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmText: string;
    onClose: () => void;
    onConfirm: () => void;
}

function ConfirmDialog(props: ConfirmDialogProps) {
    const [value, setValue] = React.useState('');
    const disabled = value !== props.confirmText;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event?.target.value);
    };

    return (
        <Modal isOpen={true} onClose={() => props.onClose()}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{props.title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text marginBottom={3}>
                        {props.message + ' Input the text '}
                        <Code>{props.confirmText}</Code> {', then select OK.'}
                    </Text>
                    <Input value={value} onChange={handleChange} placeholder={props.confirmText} />
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={() => props.onClose()}>
                        Close
                    </Button>
                    <Button variant="ghost" isDisabled={disabled} onClick={() => props.onConfirm()}>
                        OK
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default ConfirmDialog;
