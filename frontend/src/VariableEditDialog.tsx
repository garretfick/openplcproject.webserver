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
    FormControl,
    FormLabel,
    Input,
    NumberInput,
    NumberInputField,
    Switch,
    FormHelperText,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';
import React from 'react';
import { patchVariable } from './api';

interface VariableControlProps {
    item: Variable;
    value: any;
    setValue: (value: any) => void;
}

function VariableControl(props: VariableControlProps) {
    const item = props.item;

    let inputElement;
    let helpText;
    if (item.isNumeric()) {
        const min = item.minValue();
        const max = item.maxValue();
        const onChange = (value: string) => {
            props.setValue(value);
        };
        inputElement = (
            <NumberInput max={max} min={min} defaultValue={item.value} value={props.value} onChange={onChange}>
                <NumberInputField id="value" />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
        );
        helpText = `${item.typeName} type. Values range from ${min} to ${max}.`;
    } else if (item.isBoolean()) {
        const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const val = event.target.value;
            props.setValue(val);
        };
        inputElement = <Switch id="value" value={props.value} onChange={onChange} />;
        helpText = 'BOOL type. Values are TRUE or FALSE.';
    } else {
        const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const val = event.target.value;
            props.setValue(val);
        };
        inputElement = <Input id="value" defaultValue={item.value} value={props.value} onChange={onChange} />;
        helpText = 'STRING type. Values are a sequence of characters.';
    }

    return (
        <FormControl>
            <FormLabel htmlFor="value">Value</FormLabel>
            {inputElement}
            <FormHelperText>{helpText}</FormHelperText>
        </FormControl>
    );
}

export interface VariableEditDialogProps {
    item: Variable;
    onClose: () => void;
}

function VariableEditDialog(props: VariableEditDialogProps) {
    const [value, setValue] = React.useState(props.item?.value);
    const item = props.item;
    const itemId = item.name;

    const onApply = () => {
        patchVariable(item.name, value);
        // TODO don't close immediately
        props.onClose();
    };

    return (
        <Modal isOpen={true} onClose={() => props.onClose()}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit variable {itemId}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VariableControl item={item} value={value} setValue={setValue} />
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

export default VariableEditDialog;
