import { Chance } from "chance";

const chance = new Chance();

export class TokenGenerator {
  static validLookingButFakeToken(): string {
    return chance.guid();
  }

  static invalidToken(): string {
    return chance.hash({ length: 32 });
  }

  static customFakeToken(): string {
    const block = () => chance.string({ length: 4, pool: "abcdef123456" });
    return `12345678-${block()}-${block()}-${block()}-${chance.string({
      length: 12,
      pool: "0123456789",
    })}`;
  }
}
