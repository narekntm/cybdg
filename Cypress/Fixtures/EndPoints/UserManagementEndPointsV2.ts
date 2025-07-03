const root = "/api";

export class UserManagementEndPointsV2 {
  static reset = `${root}/reset`;

  static adminLogin = `${root}/login`;

  static users = (id?: number) => `${root}/users${id ? `/${id}` : ""}`;

  static status = (id: number) => `${this.users(id)}/status`;

  static seed = () => `${root}/seed`;
}
