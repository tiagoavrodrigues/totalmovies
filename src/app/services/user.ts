export interface User {
    id?: string;
    email: string;
    password: string;
    name: string;
}

export type Session = Pick<User, 'id' | 'email' | 'name'>;