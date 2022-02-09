import React from 'react';
import { chakra, Text } from '@chakra-ui/react';

interface TimestampProps {
    timestamp: number;
}

function Timestamp(props: TimestampProps) {
    return <chakra.span>{props.timestamp}</chakra.span>;
}

export default Timestamp;
