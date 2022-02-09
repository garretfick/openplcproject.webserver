import React from 'react';
import { Flex, useColorModeValue } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

export interface FileDisplayProps {
    name: string;
}

function FileDisplay(props: FileDisplayProps) {
    return (
        <Flex
            mt={1}
            justify="center"
            px={6}
            pt={5}
            pb={6}
            borderWidth={1}
            borderColor={useColorModeValue('gray.300', 'gray.500')}
            borderStyle="solid"
            rounded="md"
        >
            <CheckIcon marginRight={2} />
            {props.name}
        </Flex>
    );
}

export default FileDisplay;
