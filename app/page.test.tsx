import React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import Home from "./page"

vi.mock("../components/race-weekend-card/RaceWeekendCard", () => ({
    default: () => <div data-testid="race-weekend-card" />,
}))

vi.mock("../components/LastSessionCard", () => ({
    default: () => <div data-testid="last-session-card" />,
}))

vi.mock("../components/next-session-card/NextSessionCard", () => ({
    default: () => <div data-testid="next-session-card" />,
}))

vi.mock("../components/driver-standings-graph/DriverStandingsGraph", () => ({
    default: () => <div data-testid="driver-standings-graph" />,
}))

describe("Home", () => {
    it("renders the dashboard sections", async () => {
        render(await Home())

        expect(screen.getByRole("main")).toBeTruthy()
        expect(screen.getByTestId("next-session-card")).toBeTruthy()
        expect(screen.getByTestId("race-weekend-card")).toBeTruthy()
        expect(screen.getByTestId("driver-standings-graph")).toBeTruthy()
        expect(screen.getByTestId("last-session-card")).toBeTruthy()
    })
})
