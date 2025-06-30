const root = "/api";

export class UserManagementEndpoints {
  /** Reset server data */
  static reset = `${root}/reset`;
  /** Admin login endpoint */
  static adminLogin = `${root}/login`;
  /**
   * Users endpoint; if `id` is provided, targets a specific user.
   * @param id optional user ID
   */
  static users = (id?: number | "*") => (id !== undefined ? `${root}/users/${id}` : `${root}/users`);
  /** Toggle status for specific user */
  static status = (id: number | "*") => `${this.users(id)}/status`;
  /** Seed data */
  static seed = () => `${root}/seed`;
}
