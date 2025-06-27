const root = '/api';

export class UserManagementEndpoints {

    static adminLogin = ():string => `${root}/login`;

    static reset = ():string => `${root}/reset`;

    static users = (id?: number):string => `${root}/users${id !== undefined ? `/${id}` : ""}`;

    static status = (userId: number):string => `${this.users(userId)}/status`;
}
