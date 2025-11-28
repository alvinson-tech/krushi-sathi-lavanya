
export type UserRole = 'FARMER' | 'SELLER' | 'LABOURER';

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export type UserRegistrationData = Omit<User, 'id'>;
