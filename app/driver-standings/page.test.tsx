import React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import DriverStandings from "./page"

vi.mock("@/components/TableSkeleton", () => ({
    default: () => <div data-testid="table-skeleton">Loading standings</div>,
}))

const drivers = [
    {
        driver_number: 16,
        meeting_key: 1,
        session_key: 1,
        broadcast_name: "C LECLERC",
        full_name: "Charles Leclerc",
        name_acronym: "LEC",
        team_name: "Ferrari",
        team_colour: "E80020",
        first_name: "Charles",
        last_name: "Leclerc",
        country_code: "MON",
        headshot_url: "",
        position_start: 2,
        position_current: 2,
        points_start: 20,
        points_current: 20,
    },
    {
        driver_number: 81,
        meeting_key: 1,
        session_key: 1,
        broadcast_name: "O PIASTRI",
        full_name: "Oscar Piastri",
        name_acronym: "PIA",
        team_name: "McLaren Racing",
        team_colour: "FF8000",
        first_name: "Oscar",
        last_name: "Piastri",
        country_code: "AUS",
        headshot_url: "",
        position_start: 1,
        position_current: 1,
        points_start: 25,
        points_current: 25,
    },
]

describe("DriverStandings", () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    afterEach(() => {
        cleanup()
        vi.unstubAllGlobals()
    })

    it("shows the skeleton while standings are loading", () => {
        vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>(() => {})))

        render(<DriverStandings />)

        expect(screen.getByTestId("table-skeleton")).toBeTruthy()
    })

    it("fetches the latest standings and renders them in position order", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(drivers),
        })
        vi.stubGlobal("fetch", fetchMock)

        render(<DriverStandings />)

        await waitFor(() => expect(screen.getByText("DRIVER STANDINGS")).toBeTruthy())

        expect(fetchMock).toHaveBeenCalledWith("/api/driver-standings/latest")
        expect(screen.getByText("Charles Leclerc")).toBeTruthy()
        expect(screen.getByText("Oscar Piastri")).toBeTruthy()

        const rows = screen.getAllByRole("row")
        expect(rows[1].textContent).toContain("1")
        expect(rows[1].textContent).toContain("Oscar Piastri")
        expect(rows[2].textContent).toContain("2")
        expect(rows[2].textContent).toContain("Charles Leclerc")
    })

    it("keeps the skeleton visible when the standings response is not ok", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: false,
            json: vi.fn(),
        }))

        render(<DriverStandings />)

        await waitFor(() => expect(screen.getByTestId("table-skeleton")).toBeTruthy())
        expect(screen.queryByText("DRIVER STANDINGS")).toBeNull()
    })

    it("clears the polling interval when unmounted", () => {
        vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>(() => {})))
        const setIntervalSpy = vi.spyOn(globalThis, "setInterval")
        const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval")

        const { unmount } = render(<DriverStandings />)

        expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 60000)
        unmount()
        expect(clearIntervalSpy).toHaveBeenCalled()
    })
})