export enum State {
    RUNNING = 'RUNNING',
    COMPILING = 'COMPILING',
    STOPPED = 'STOPPED',
}

export interface StateInfo {
    state: State;
    name: string;
    description: string;
    path: string;
    hostname: string;
    uptime: string;
}

export interface StateRequest {
    state: State;
    message: string;
}

export interface Logs {
    data: string;
}
