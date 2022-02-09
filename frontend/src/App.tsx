import React from 'react';
import {
    Box,
    Drawer,
    DrawerContent,
    DrawerOverlay,
    Flex,
    Heading,
    IconButton,
    Image,
    Text,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { Link, RouteComponentProps, Router } from '@reach/router';
import { FiMenu } from 'react-icons/fi';
import Dashboard from './Dashboard';
import Hardware from './Hardware';
import Header from './Header';
import Monitoring from './Monitoring';
import Programs from './Programs';
import ModbusDevices from './ModbusDevices';
import Settings from './Settings';
import Users from './Users';

interface NavPage {
    label: string;
    component: any;
    icon: string;
    url: string;
}

interface RouteProps extends RouteComponentProps {
    data: NavPage;
}

function Route(props: RouteProps) {
    return (
        <div>
            <Heading as="h1" marginBottom={5}>
                {props.data.label}
            </Heading>
            {props.data.component}
        </div>
    );
}

const data = [
    {
        label: 'Dashbord',
        url: '/',
        component: <Dashboard />,
        icon: 'home-icon-64x64.png',
    },
    {
        label: 'Programs',
        url: 'programs',
        component: <Programs />,
        icon: 'programs-icon-64x64.png',
    },
    {
        label: 'Modbus Devices',
        url: 'devices',
        component: <ModbusDevices />,
        icon: 'modbus-icon-512x512.png',
    },
    {
        label: 'Monitoring',
        url: 'monitoring',
        component: <Monitoring />,
        icon: 'monitoring-icon-64x64.png',
    },
    {
        label: 'Hardware',
        url: 'hardware',
        component: <Hardware />,
        icon: 'hardware-icon-980x974.png',
    },
    {
        label: 'Users',
        url: 'users',
        component: <Users />,
        icon: 'users-icon-64x64.png',
    },
    {
        label: 'Settings',
        url: 'settings',
        component: <Settings />,
        icon: 'settings-icon-64x64.png',
    },
    {
        label: 'Logout',
        url: 'logout',
    },
] as NavPage[];

const App = () => {
    const sidebar = useDisclosure();

    const NavItem = (props: any) => {
        const { icon, routeKey, url, image, children, ...rest } = props;
        return (
            <Flex
                key={routeKey}
                align="center"
                px="4"
                mx="2"
                rounded="md"
                py="3"
                cursor="pointer"
                color="whiteAlpha.700"
                _hover={{
                    bg: 'blackAlpha.300',
                    color: 'whiteAlpha.900',
                }}
                role="group"
                fontWeight="semibold"
                transition=".15s ease"
                {...rest}
            >
                <Link key={routeKey} to={url} style={{ display: 'inline-flex' }}>
                    {image && (
                        <Image
                            mr="2"
                            boxSize="4"
                            _groupHover={{
                                color: 'gray.300',
                            }}
                            src={'static/img/' + image}
                        />
                    )}
                    {children}
                </Link>
            </Flex>
        );
    };

    interface SidebarContentProps {
        display?: any;
        w?: any;
        borderRight?: any;
    }

    const SidebarContent = (props: SidebarContentProps) => (
        <Box
            as="nav"
            pos="fixed"
            top="0"
            left="0"
            zIndex="sticky"
            h="full"
            pb="10"
            overflowX="hidden"
            overflowY="auto"
            bg="brand.600"
            borderColor="blackAlpha.300"
            borderRightWidth="1px"
            w="60"
            {...props}
        >
            <Flex px="4" py="5" align="center">
                <Text fontSize="2xl" ml="2" color="white" fontWeight="semibold">
                    OpenPLC
                </Text>
            </Flex>
            <Flex direction="column" as="nav" fontSize="sm" color="gray.600" aria-label="Main Navigation">
                {data.map((item, index) => (
                    <NavItem routeKey={index} url={item.url} image={item.icon} key={item.url}>
                        {item.label}
                    </NavItem>
                ))}
            </Flex>
        </Box>
    );
    return (
        <Box as="section" bg={useColorModeValue('gray.50', 'gray.700')} minH="100vh">
            <SidebarContent display={{ base: 'none', md: 'unset' }} />
            <Drawer isOpen={sidebar.isOpen} onClose={sidebar.onClose} placement="left">
                <DrawerOverlay />
                <DrawerContent>
                    <SidebarContent w="full" borderRight="none" />
                </DrawerContent>
            </Drawer>
            <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
                <Flex
                    as="header"
                    align="center"
                    justify="space-between"
                    w="full"
                    px="4"
                    bg={useColorModeValue('white', 'gray.800')}
                    borderBottomWidth="1px"
                    borderColor="blackAlpha.300"
                    h="14"
                >
                    <IconButton
                        aria-label="Menu"
                        display={{ base: 'inline-flex', md: 'none' }}
                        onClick={sidebar.onOpen}
                        icon={<FiMenu />}
                        size="sm"
                    />
                    <Header />
                </Flex>

                <Box as="main" p="4">
                    <Router>
                        {data.map((page, index) => (
                            <Route path={page.url} data={page} key={page.url} />
                        ))}
                    </Router>
                </Box>
            </Box>
        </Box>
    );
};

export default App;
