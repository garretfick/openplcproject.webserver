import { ModbusDevice } from './model/ModbusDevice';
import { NewProgram, Program } from './model/Program';
import { RuntimeSettings } from './model/RuntimeSettings';
import { Logs, StateInfo, StateRequest } from './model/State';
import { User } from './model/User';
import { Variable, VariableImpl } from './model/Variable';

interface Driver {
    id: string;
    name: string;
}

export interface Drivers {
    items: Driver[];
    selected: string;
}

const URL_BASE = 'http://localhost:8000/';

function get<T>(urlPath: string): Promise<T> {
    return fetch(URL_BASE + urlPath).then((response) => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json() as Promise<T>;
    });
}

/**
 * Put creates a new object using the URL base and specified data for the
 * new object. This has the effect of replacing the object that already exists
 * at the URL.
 * @param urlPath The path to create a new object.
 * @param data The data to encode as JSON to create the object.
 * @returns
 */
function put<T>(urlPathTemplate: string, itemId: string | undefined, data: any): Promise<T> {
    const url = itemId !== undefined ? urlPathTemplate.replace('%s', encodeURIComponent(itemId)) : urlPathTemplate;
    return fetch(URL_BASE + url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((response) => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json() as Promise<T>;
    });
}

/**
 * Post creates a new object.
 * @param urlPath The URL path to create the new object.
 * @param data The new data for the object.
 * @returns
 */
function post<T>(urlPath: string, data: any): Promise<T> {
    return fetch(URL_BASE + urlPath, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
    }).then((response) => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json() as Promise<T>;
    });
}

/**
 * Patch updates part of an object (that already exists). This is in contrast
 * to post that replaces the object entirely.
 * @param urlPathTemplate
 * @param itemId
 * @param data
 * @returns
 */
function patch<T>(urlPathTemplate: string, itemId: string, data: any): Promise<T> {
    const url = urlPathTemplate.replace('%s', encodeURIComponent(itemId));
    return fetch(URL_BASE + url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
    }).then((response) => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json() as Promise<T>;
    });
}

/**
 * Remove deletes the object.
 * @param urlPathTemplate A URL-template that defines the path to the resource.
 *                        The path must have a '%s' token to replace.
 * @param itemId The ID of the object to replace. Replace substitutes '%s' in
 *               the template with then URL encoded representation of the item
 *               ID.
 * @returns A promise representing the request-reply. Unlike other HTTP methods
 *          the remote operation does not return data in the response.
 */
function remove(urlPathTemplate: string, itemId: string) {
    const url = urlPathTemplate.replace('%s', encodeURIComponent(itemId));
    return fetch(URL_BASE + url, {
        method: 'DELETE',
    });
}

const fetchLogs = async () => {
    return get<Logs>('logs');
};

const fetchState = async () => {
    return get<StateInfo>('state');
};

const updateState = async (state: StateRequest) => {
    return put<StateInfo>('state', '', state);
};

const fetchPrograms = async () => {
    return get<{ id: string; name: string; fileName: string; createdAt: number }[]>('programs').then((data) => {
        return data.map((item) => {
            const createdAt = new Date(item.createdAt);
            return {
                ...item,
                createdAt,
            } as Program;
        });
    });
};

const createProgram = async (program: NewProgram) => {
    return post('programs', program);
};

const deleteProgram = async (programId: string) => {
    return remove('programs/%s', programId);
};

const compileProgram = async (programId: string) => {
    return put('programs/%s/actions/compile', programId, undefined);
};

const fetchModbusDevices = async () => {
    return get<ReadonlyArray<ModbusDevice>>('devices');
};

const createDevice = async (device: ModbusDevice) => {
    return post('devices', device);
};

const fetchVariables = async () => {
    return (await get<ReadonlyArray<Variable>>('variables')).map((item) => {
        const obj = new VariableImpl();
        Object.assign(obj, item);
        return obj;
    });
};

const patchVariable = async (name: string, value: string) => {
    return patch<Variable>('variables/%s', name, { value });
};

const fetchPorts = async () => {
    return get<string[]>('ports');
};

const fetchDrivers = async () => {
    return get<Drivers>('drivers');
};

const selectDriver = async (id: string) => {
    return post('drivers?selected=%s', id);
};

const fetchCustomDriver = async () => {
    return get<{ data: string }>('customDriver');
};

const updateCustomDriver = async (code: { data: string }) => {
    return put('customDriver', undefined, code);
};

const resetCustomDriver = async () => {
    return put('customDriver/actions/reset', undefined, undefined);
};

const fetchUsers = async () => {
    return get<ReadonlyArray<User>>('users');
};

const createUser = async (user: User) => {
    return post('users', user);
};

const deleteUser = async (user_id: string) => {
    return remove('users/%s', user_id);
};

const fetchSettings = async () => {
    return get<RuntimeSettings>('settings');
};

export {
    fetchLogs,
    fetchState,
    updateState,
    fetchPrograms,
    createProgram,
    deleteProgram,
    compileProgram,
    fetchModbusDevices,
    createDevice,
    fetchVariables,
    patchVariable,
    fetchPorts,
    fetchDrivers,
    selectDriver,
    fetchCustomDriver,
    updateCustomDriver,
    resetCustomDriver,
    fetchUsers,
    createUser,
    deleteUser,
    fetchSettings,
};
