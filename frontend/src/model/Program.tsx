export interface Program {
    id: string;
    name: string;
    description: string;
    fileName: string;
    createdAt: Date;
}

export interface NewProgram {
    name: string;
    description: string;
    data: string;
    fileName: string;
}
