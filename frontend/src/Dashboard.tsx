import React from 'react';
import { Box, chakra, Flex } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { fetchState } from './api';
import Logs from './Logs';
import StateBadge from './StateBadge';

function Dashboard() {
    const { status, data, error } = useQuery('state', fetchState);

    if (status === 'loading') {
        return <span>Loading...</span>;
    }

    if (status === 'error') {
        return <span>Error: {error}</span>;
    }

    return (
        <Flex p={50} w="full" alignItems="center" justifyContent="center">
            <Box mx="auto" px={8} py={4} rounded="lg" shadow="lg" maxW="2xl">
                <Flex justifyContent="space-between" alignItems="center">
                    <chakra.span fontSize="sm">
                        {data?.uptime ? 'Running ' + data.uptime + ' s' : 'Unknown uptime'}
                    </chakra.span>
                    <StateBadge state={data?.state} />
                </Flex>

                <Box mt={2}>
                    <chakra.p fontSize="2xl" fontWeight="700">
                        {data?.name}
                    </chakra.p>
                    <chakra.p mt={2}>
                        {data?.description ? data.description : 'No description for selected program.'}
                    </chakra.p>
                    <chakra.div mt={2} minW="md">
                        {data?.path} on {data?.hostname ? data.hostname : 'unreported host'}
                    </chakra.div>
                </Box>
                <Logs />
            </Box>
        </Flex>
    );
}

export default Dashboard;
