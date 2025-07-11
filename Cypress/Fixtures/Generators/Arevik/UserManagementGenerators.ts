export class UserManagementGenerators {
  static validAdminCredentials(): { email: string; password: string } {
    return {
      email: "admin@example.com",
      password: "admin123",
    };
  }
  static invalidAdminCredentials(): { email: string; password: string } {
    return {
      email: "wrong@admin.com",
      password: "wrongpass",
    };
  }
  static userInput(): {
    name: string;
    role: string;
    age: number;
    email: string;
    gender: string;
    subscriptions?: string[];
  } {
    return {
      name: "Test User",
      role: "Viewer",
      age: 25,
      email: "test@example.com",
      gender: "Other",
      subscriptions: [],
    };
  }
  static validUserArevik(): {
    name: string;
    role: string;
    age: number;
    email: string;
    gender: string;
    subscriptions: string[];
  } {
    return {
      name: "Arevik",
      role: "Editor",
      age: 28,
      email: "arevik@example.com",
      gender: "Female",
      subscriptions: ["Newsletter"],
    };
  }
  static userForPagination(index: number): {
    name: string;
    role: string;
    age: number;
    email: string;
    gender: string;
    subscriptions: string[];
  } {
    return {
      name: `User${index}`,
      role: "Viewer",
      age: 20 + index,
      email: `user${index}@example.com`,
      gender: "Other",
      subscriptions: [],
    };
  }
  static emptyUserForm(): {
    name: string;
    role: string;
    age?: number;
    email: string;
    gender: string;
    subscriptions?: string[];
  } {
    return {
      name: "",
      role: "",
      email: "",
      gender: "",
      subscriptions: [],
    };
  }
  static userEve(): { name: string } {
    return {
      name: "Eve",
    };
  }
}
