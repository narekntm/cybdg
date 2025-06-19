

export enum userTableColumn {
Name = 0,
Role = 1,
Age = 2,
Email = 3,
Gender = 4,
Subscription = 5,
Status = 6,
Actions = 7
}

export enum userTableActions {
    Edit = 'Edit',
    Delete = 'Delete',
    Deactivate = 'Deactivate',
    Activate = 'Activate',
}

export interface AddUser {
    fullName: string,
    role: string ,
    age: string,
    email: string,
    gender: "Male" | "Female" | "Other",
    subscriptions: []
}

export interface Login {
    adminEmail: string,

}