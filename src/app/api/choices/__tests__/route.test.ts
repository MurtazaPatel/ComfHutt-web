/**
 * @jest-environment node
 */
import { POST } from "../route";
import { db } from "@/lib/db";

// Mock DB
jest.mock("@/lib/db", () => ({
  db: {
    $transaction: jest.fn((callback) => callback(db)),
    lead: {
      upsert: jest.fn(),
    },
    choiceResponse: {
      create: jest.fn(),
    },
  },
}));

describe("POST /api/choices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and create lead + response on valid input", async () => {
    const body = {
      intent: "invest",
      nps: 9,
      email: "test@example.com",
      name: "Test User",
    };

    const req = new Request("http://localhost/api/choices", {
      method: "POST",
      body: JSON.stringify(body),
    });

    // Mock DB responses
    (db.lead.upsert as jest.Mock).mockResolvedValue({ id: "lead-123" });
    (db.choiceResponse.create as jest.Mock).mockResolvedValue({ id: "resp-456" });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(db.lead.upsert).toHaveBeenCalled();
    expect(db.choiceResponse.create).toHaveBeenCalled();
  });

  it("should return 400 on invalid input", async () => {
    const body = {
      intent: "invalid-intent", // Invalid enum
      email: "not-an-email",
    };

    const req = new Request("http://localhost/api/choices", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Validation failed");
  });
});