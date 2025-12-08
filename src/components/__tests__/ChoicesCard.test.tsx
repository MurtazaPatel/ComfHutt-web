import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChoicesCard from "../ChoicesCard";

// Mock fetch
global.fetch = jest.fn();

describe("ChoicesCard", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("renders the first step correctly", () => {
    render(<ChoicesCard />);
    expect(screen.getByText("What's your primary goal?")).toBeInTheDocument();
    expect(screen.getByText("Invest")).toBeInTheDocument();
    expect(screen.getByText("List Property")).toBeInTheDocument();
  });

  it("navigates to the next step after selecting intent", async () => {
    render(<ChoicesCard />);
    
    // Select Invest
    fireEvent.click(screen.getByText("Invest"));
    
    // Click Continue
    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("How likely are you to use ComfHutt?")).toBeInTheDocument();
    });
  });

  it("validates email input", async () => {
    render(<ChoicesCard />);
    
    // Step 1: Select Invest -> Continue
    fireEvent.click(screen.getByText("Invest"));
    fireEvent.click(screen.getByText("Continue"));
    await waitFor(() => screen.getByText("How likely are you to use ComfHutt?"));

    // Step 2: Continue (NPS has default)
    fireEvent.click(screen.getByText("Continue"));
    await waitFor(() => screen.getByText("Where should we send your invite?"));

    // Step 3: Try submitting empty form
    const submitBtn = screen.getByText("Get Access");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument();
    });
  });

  it("submits the form successfully", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });

    render(<ChoicesCard />);

    // Step 1
    fireEvent.click(screen.getByText("Invest"));
    fireEvent.click(screen.getByText("Continue"));
    await waitFor(() => screen.getByText("How likely are you to use ComfHutt?"));

    // Step 2
    fireEvent.click(screen.getByText("Continue"));
    await waitFor(() => screen.getByText("Where should we send your invite?"));

    // Step 3
    fireEvent.change(screen.getByPlaceholderText("jane@example.com"), {
      target: { value: "test@example.com" },
    });
    
    fireEvent.click(screen.getByText("Get Access"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/choices", expect.any(Object));
      expect(screen.getByText("You're on the list.")).toBeInTheDocument();
    });
  });
});