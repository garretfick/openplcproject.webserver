import React from 'react';
import { chakra, Switch } from '@chakra-ui/react';
import { useMutation, useQuery } from 'react-query';
import { fetchState, updateState } from './api';
import { State } from './model/State';

function StateControl() {
    const setState = useMutation('updateState', updateState);
    const result = useQuery('state', fetchState);
    const { data } = result;

    const toggleState = (event: React.ChangeEvent<HTMLInputElement>) => {
        const state = event.target.checked ? State.STOPPED : State.RUNNING;
        setState.mutate({ state, message: 'none' });
    };

    return (
        <>
            <chakra.div
                px={3}
                bg="gray.600"
                color="gray.100"
                fontSize="sm"
                fontWeight="700"
                rounded="md"
                _hover={{ bg: 'gray.500' }}
            >
                <Switch mx={1} isChecked={data?.state === State.RUNNING} onChange={toggleState} />
                <chakra.span m={2} minW="6em" display="inline-block">
                    {data?.state || 'Unknown'}
                </chakra.span>
            </chakra.div>
        </>
    );
}

export default StateControl;
