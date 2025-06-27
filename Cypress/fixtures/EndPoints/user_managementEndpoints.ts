const root ="api"

export class UserManagementEndpoints {

    static reset = `${root} /reset`;
   
    static adminLogin = `${root}/login`;

    static Users = (id?: number) => `${root}/users${id ?? `/${id}`}`;

    static getUsers = () => `${root}/users`

    //static UserEdit = (id: number) =>    `${root}/userEdit`

    static Status = (id: number) => `${this.Users(id)}/status`;
 }