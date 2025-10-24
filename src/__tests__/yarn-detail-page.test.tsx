/**
 * @file YarnInfoPage tests (dynamic route)
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("next/image", () => (props: any) => <img {...props} />);
const notFoundMock = jest.fn();
jest.mock("next/navigation", () => ({ notFound: () => notFoundMock() }));

import YarnInfoPage from "@/app/home/yarn/[id]/page";

describe("YarnInfoPage /home/yarn/[id]", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders details for a known yarn id", () => {
    render(<YarnInfoPage params={{ id: "1" }} />);
    expect(screen.getByRole("heading", { name: "Sheep Soft" })).toBeInTheDocument();
    expect(screen.getByText("WoolEase")).toBeInTheDocument();
    expect(screen.getByText("Worsted")).toBeInTheDocument(); // spec value
  });

  it("calls notFound for an unknown id", () => {
    render(<YarnInfoPage params={{ id: "999" }} />);
    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });
});
