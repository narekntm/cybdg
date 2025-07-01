const root = "/api"

export class UserManagementEndPoints {

    static reset = `${root}/reset`

    static adminLogin = `${root}/login`

    static Users = (id?: number) => `${root}/users${id !== undefined ? `/${id}` : ''}`

    static Status = (id: number) => `${this.Users(id)}/status`

    static Seed = () => `${root}/seed`
}