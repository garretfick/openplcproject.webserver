export enum Protocol {
    TCP = 1,
    RTU = 2,
}

export interface RegisterDefinition {
    start?: number;
    size?: number;
}

export interface ModbusDevice {
    id: string;
    name: string;
    constraintId: string;

    protocol: Protocol;
    slaveId?: number;

    // IP devices
    address?: string;
    port?: number;

    // Modbus devices
    commPort?: string;
    baudRate?: number;
    parity?: string;
    dataBits?: number;
    stopBits?: number;

    di: RegisterDefinition;
    do: RegisterDefinition;
    ai: RegisterDefinition;
    aor: RegisterDefinition;
    aow: RegisterDefinition;

    [index: string]: RegisterDefinition | number | string | undefined;
}
