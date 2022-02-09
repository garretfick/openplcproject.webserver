export interface RuntimeSettings {
    modbusEnabled: boolean;
    modbusPort: number;

    dnp3Enabled: boolean;
    dnp3Port: number;

    enipEnabled: boolean;
    enipPort: number;

    storageEnabled: boolean;
    storagePeriod: number;

    pollPeriod: number;
    timeout: number;
    refreshPeriod: number;

    startInRun: boolean;
}
