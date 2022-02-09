import React from 'react';
import { chakra, Flex } from '@chakra-ui/react';
import StateControl from './StateControl';

const Header = () => {
    return (
        <>
            <chakra.div w="2" display={{ base: 'none', md: 'flex' }}></chakra.div>

            <Flex align="center">
                <StateControl />
            </Flex>
        </>
    );
};

export default Header;
