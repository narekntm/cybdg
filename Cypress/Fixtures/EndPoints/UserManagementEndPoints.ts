const root = "/api"
export class UserManagementEndPoints{
    static reset = `${root}/reset`
    static adminlogin = `${root}/login`
    static Users = (id ? : number) => `${root}/users${id ?? / ${id}}`
}