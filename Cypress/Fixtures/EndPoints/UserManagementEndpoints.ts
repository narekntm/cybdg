const root = "/api";

export class UserManagementEndpoints {
  static Users = (id?: number) => `${root}/users${id !== undefined ? `/${id}` : ""}`;

  static Status = (id: number) => `${this.Users(id)}/status`;

  static adminLogin = `${root}/login`;

  static reset = `${root}/reset`;
}
