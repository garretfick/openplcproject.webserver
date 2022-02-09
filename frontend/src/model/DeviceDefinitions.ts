import { Protocol, RegisterDefinition } from './ModbusDevice';

export interface DeviceDefinition {
    id: string;
    name: string;

    protocol: Protocol;
    slaveId?: number;

    // IP devices
    address?: string;
    port?: number;

    // Modbus devices
    baudRate?: number;
    parity?: string;
    dataBits?: number;
    stopBits?: number;

    di: RegisterDefinition;
    do: RegisterDefinition;
    ai: RegisterDefinition;
    aor: RegisterDefinition;
    aow: RegisterDefinition;
}

const devices: DeviceDefinition[] = [
    {
        id: 'Uno',
        name: 'Arduino Uno',
        protocol: Protocol.RTU,
        slaveId: 0,
        baudRate: 11500,
        dataBits: 8,
        stopBits: 1,
        di: {
            start: 0,
            size: 5,
        },
        do: {
            start: 0,
            size: 4,
        },
        ai: {
            start: 0,
            size: 6,
        },
        aor: {
            start: 0,
            size: 0,
        },
        aow: {
            start: 0,
            size: 3,
        },
    },
    {
        id: 'Mega',
        name: 'Arduino Mega',
        protocol: Protocol.RTU,
        slaveId: 0,
        baudRate: 11500,
        dataBits: 8,
        stopBits: 1,
        di: {
            start: 0,
            size: 24,
        },
        do: {
            start: 0,
            size: 16,
        },
        ai: {
            start: 0,
            size: 16,
        },
        aor: {
            start: 0,
            size: 0,
        },
        aow: {
            start: 0,
            size: 12,
        },
    },
    {
        id: 'EPS32',
        name: 'EPS32',
        protocol: Protocol.TCP,
        slaveId: 0,
        port: 502,
        di: {
            start: 0,
            size: 8,
        },
        do: {
            start: 0,
            size: 8,
        },
        ai: {
            start: 0,
            size: 1,
        },
        aor: {
            start: 0,
            size: 0,
        },
        aow: {
            start: 0,
            size: 1,
        },
    },
    {
        id: 'EPS8266',
        name: 'EPS8266',
        protocol: Protocol.TCP,
        slaveId: 0,
        port: 502,
        di: {
            start: 0,
            size: 8,
        },
        do: {
            start: 0,
            size: 8,
        },
        ai: {
            start: 0,
            size: 1,
        },
        aor: {
            start: 0,
            size: 0,
        },
        aow: {
            start: 0,
            size: 1,
        },
    },
    {
        id: 'TCP',
        name: 'Generic Modbus TCP Device',
        protocol: Protocol.TCP,
        di: {},
        do: {},
        ai: {},
        aor: {},
        aow: {},
    },
    {
        id: 'RTU',
        name: 'Generic Modbus RTU Device',
        protocol: Protocol.RTU,
        di: {},
        do: {},
        ai: {},
        aor: {},
        aow: {},
    },
];

export { Protocol, devices };
