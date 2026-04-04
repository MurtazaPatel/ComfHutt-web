import { register } from "../auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";

// Mock dependencies
jest.mock("@/lib/db", () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    waitlistEntry: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("@/lib/password", () => ({
  hashPassword: jest.fn(),
}));

jest.mock("@/auth", () => ({
  signIn: jest.fn(),
}));

describe("register action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return error if email is invalid", async () => {
    const result = await register({ email: "invalid-email", password: "password123" });
    expect(result).toEqual({ error: "Invalid fields" });
  });

  it("should return error if email already exists", async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue({ id: "existing-id" });
    
    const result = await register({ email: "test@example.com", password: "password123" });
    
    expect(db.user.findUnique).toHaveBeenCalledWith({ where: { email: "test@example.com" } });
    expect(result).toEqual({ error: "Email already in use" });
  });

  it("should create user if email is valid and new", async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValue(null);
    (hashPassword as jest.Mock).mockResolvedValue("hashed-password");
    (db.user.create as jest.Mock).mockResolvedValue({ id: "new-id" });
    
    // Mock signIn to throw redirect error or succeed (depending on implementation)
    // For this test we assume it resolves or throws a specific NextAuth error we catch
    const signInMock = require("@/auth").signIn;
    signInMock.mockResolvedValue(undefined);

    const result = await register({ email: "new@example.com", password: "password123" });

    expect(db.user.create).toHaveBeenCalledWith({
      data: {
        name: "new",
        email: "new@example.com",
        passwordHash: "hashed-password",
      },
    });
    expect(result).toEqual({ success: "Account created!" });
  });
});