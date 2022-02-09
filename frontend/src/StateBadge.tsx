import React from 'react';
import { chakra } from '@chakra-ui/react';
import { State } from './model/State';

export interface StateBadgeProps {
    state?: State;
}

function StateBadge(props: StateBadgeProps) {
    return (
        <chakra.span
            px={3}
            py={1}
            m={2}
            bg="gray.600"
            color="gray.100"
            fontSize="sm"
            fontWeight="700"
            rounded="md"
            _hover={{ bg: 'gray.500' }}
        >
            {props.state}
        </chakra.span>
    );
}

export default StateBadge;
