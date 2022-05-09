export interface User {
    // TODO encoding as a number is not idea - rounding errors
    // are at least possible
    id: number;
    name: string;
    username: string;
    email: string;
    // Password is not returned from the
    // backend. Only set when changing
    // the password.
    password: string;
}
