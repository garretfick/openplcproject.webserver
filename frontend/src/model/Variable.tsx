const NUMERIC_TYPES = ['UINT', 'INT', 'REAL', 'LREAL'];

export interface Variable {
    name: string;
    typeName: string;
    location: string;
    forced: string;
    value: string;

    isNumeric: () => boolean;
    isBoolean: () => boolean;
    maxValue: () => number;
    minValue: () => number;
    maxLength: () => number;
    isAssignableTo: (value: string) => boolean;
}

export class VariableImpl implements Variable {
    name = '';
    typeName = '';
    location = '';
    forced = '';
    value = '';
    isNumeric() {
        return NUMERIC_TYPES.includes(this.typeName);
    }
    isBoolean() {
        return this.typeName === 'BOOL';
    }
    maxValue() {
        // TODO
        return 100;
    }
    minValue() {
        // TODO
        return 0;
    }
    maxLength() {
        return 10;
    }
    isAssignableTo(value: string) {
        // TODO and use this for monitoring
        return true;
    }
}
