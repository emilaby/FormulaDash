import React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import DriverStandingsGraph from "./DriverStandingsGraph"

vi.mock("./DriverStandingsGraphSkeleton", () => ({
    default: () => <div data-testid="graph-skeleton">Loading graph</div>,
}))

const graphData = {
    driverNums: [4, 16],
    drivers: [
        { driver_number: 4, last_name: "Norris", team_colour: "FF8000" },
        { driver_number: 16, last_name: "Leclerc", team_colour: "E80020" },
    ],
    standingsPerRace: [
        { location: "Bahrain", 4: 26, 16: 18 },
        { location: "Saudi Arabia", 4: 44, 16: 36 },
    ],
}

describe("DriverStandingsGraph", () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    afterEach(() => {
        cleanup()
        vi.unstubAllGlobals()
    })

    it("shows the skeleton while graph data is loading", () => {
        vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>(() => {})))

        render(<DriverStandingsGraph />)

        expect(screen.getByTestId("graph-skeleton")).toBeTruthy()
    })

    it("fetches the standings history and renders the graph", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(graphData),
        })
        vi.stubGlobal("fetch", fetchMock)

        render(<DriverStandingsGraph />)

        await waitFor(() => expect(screen.getByText("DRIVER STANDINGS")).toBeTruthy())

        expect(fetchMock).toHaveBeenCalledWith("/api/driver-standings/graph-data")
        expect(screen.queryByTestId("graph-skeleton")).toBeNull()
    })

    it("keeps the skeleton visible when the graph response is not ok", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: false,
            json: vi.fn(),
        }))

        render(<DriverStandingsGraph />)

        await waitFor(() => expect(screen.getByTestId("graph-skeleton")).toBeTruthy())
        expect(screen.queryByText("DRIVER STANDINGS")).toBeNull()
    })

    it("clears the polling interval when unmounted", () => {
        vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>(() => {})))
        const setIntervalSpy = vi.spyOn(globalThis, "setInterval")
        const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval")

        const { unmount } = render(<DriverStandingsGraph />)

        expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 60000)
        unmount()
        expect(clearIntervalSpy).toHaveBeenCalled()
    })
})
