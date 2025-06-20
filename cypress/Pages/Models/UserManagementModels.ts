export enum UserTable {
    name = 0,
    role = 1,
    age = 2,
    email = 3,
    gender = 4,
    subscribtion = 5,
    status = 6
}

export enum UserTableActions {
    edit = "Edit",
    delete = "Delete",
    activate = "Activate",
    deactivate = "Deactivate"
}

export interface NewUser {
    name? : string
    role? : string
    age? : string
    email? : string
    gender? : string
    subscribtion ?: string
}

export enum SignIn {
    email = "admin@example.com",
    password = "admin123"
}

export interface AdminLoginData {
    email? : string
    password? : string
}