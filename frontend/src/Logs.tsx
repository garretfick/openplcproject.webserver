import React from 'react';
import { useQuery } from 'react-query';
import { fetchLogs } from './api';
import { chakra } from '@chakra-ui/react';

function Logs() {
    const { status, data, error } = useQuery('logs', fetchLogs);

    if (status === 'loading') {
        return <span>Loading...</span>;
    }

    if (status === 'error') {
        return <span>Error: {error}</span>;
    }

    return (
        <chakra.pre py={10} h="300px" overflow="scroll">
            {data?.data}
        </chakra.pre>
    );
}

export default Logs;
