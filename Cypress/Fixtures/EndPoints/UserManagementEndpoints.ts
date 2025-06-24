const root = "api";

export class UserManagementEndpoints {

    static Users = (id?: number) => `${root}/users${id !== undefined ? `/${id}` : ""}`;

    static reset = `${root}/reset`;

    static adminLogin = `${root}/login`;

    static Status(id: number) {
        return `${this.Users(id)}/status`;
    }

}
