export interface UserFormData {
    name: string;
    role: string;
    age: string;
    email: string;
    gender: string;
    subscriptions?: string[];
}

export interface LoginData {
    email?: string,
    password?: string,
}

export enum LoginValues {
    email = "admin@example.com",
    password = "admin123",
}