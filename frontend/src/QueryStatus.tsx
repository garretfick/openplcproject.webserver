import React from 'react';
import { chakra, Text } from '@chakra-ui/react';
import { UseQueryResult } from 'react-query';
import Timestamp from './Timestamp';

interface QueryStatusProps {
    result: UseQueryResult;
}

function QueryStatus(props: QueryStatusProps) {
    return (
        <chakra.span>
            {'Data: ' + props.result.status + ' at '}
            {props.result.isSuccess && <Timestamp timestamp={props.result.dataUpdatedAt} />}
            {props.result.isError && <Timestamp timestamp={props.result.errorUpdatedAt} />}
        </chakra.span>
    );
}

export default QueryStatus;
