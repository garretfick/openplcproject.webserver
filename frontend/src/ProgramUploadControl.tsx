import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import FileControl from './FileControl';
import FileDisplay from './FileDisplay';
import { NewProgram } from './model/Program';

export interface ProgramUploadControlProps {
    onClose: () => void;
    onAccept: (program: NewProgram) => void;
}

function ProgramUploadControl(props: ProgramUploadControlProps) {
    const [programData, setProgramData] = useState<{ filename: string; data: string } | null>(null);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const onUpload = () => {
        if (programData) {
            const program = {
                name,
                data: programData.data,
                description,
            } as NewProgram;
            props.onAccept(program);
            props.onClose();
        }
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
                <ModalHeader>Upload Program</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FileControl
                        accept=".st"
                        description="Supports Structured Text Files"
                        onSelected={(file) => {
                            setProgramData(file);
                            setName(file.filename);
                        }}
                    />
                    {programData && (
                        <>
                            <FormLabel>File</FormLabel>
                            <FileDisplay name={programData.filename} />
                        </>
                    )}

                    <FormControl>
                        <FormLabel htmlFor="name">Program Name</FormLabel>
                        <Input id="name" value={name} onChange={(event) => setName(event.target.value)} />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={() => props.onClose()}>
                        Close
                    </Button>
                    <Button variant="ghost" isActive={!!programData} onClick={onUpload}>
                        Upload
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default ProgramUploadControl;
