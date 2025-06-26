const root = '/api';

export class UserManagementEndpoints {
    static getUsers = () => {`${root}/users`}
    static Users = (id?: number) => `${root}/users${id ?? `/${id}`}`;

    static reset = () => `${root}/reset`;

    static adminLogin = () => `${root}/login`;

    static status = (userId: number) => `${this.Users(userId)}/status`;
}