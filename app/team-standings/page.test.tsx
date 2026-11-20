import React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import TeamStandings from "./page"

vi.mock("@/components/TableSkeleton", () => ({
    default: () => <div data-testid="table-skeleton">Loading standings</div>,
}))

const teams = [
    {
        team_name: "Ferrari",
        meeting_key: 1,
        session_key: 1,
        team_colour: "E80020",
        position_start: 2,
        position_current: 2,
        points_start: 20,
        points_current: 20,
    },
    {
        team_name: "McLaren",
        meeting_key: 1,
        session_key: 1,
        team_colour: "FF8000",
        position_start: 1,
        position_current: 1,
        points_start: 25,
        points_current: 25,
    },
]

describe("TeamStandings", () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    afterEach(() => {
        cleanup()
        vi.unstubAllGlobals()
    })

    it("shows the skeleton while standings are loading", () => {
        vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>(() => {})))

        render(<TeamStandings />)

        expect(screen.getByTestId("table-skeleton")).toBeTruthy()
    })

    it("fetches the latest standings and renders them in position order", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(teams),
        })
        vi.stubGlobal("fetch", fetchMock)

        render(<TeamStandings />)

        await waitFor(() => expect(screen.getByText("TEAM STANDINGS")).toBeTruthy())

        expect(fetchMock).toHaveBeenCalledWith("/api/team-standings/latest")
        expect(screen.getByText("Ferrari")).toBeTruthy()
        expect(screen.getByText("McLaren")).toBeTruthy()

        const rows = screen.getAllByRole("row")
        expect(rows[1].textContent).toContain("1")
        expect(rows[1].textContent).toContain("McLaren")
        expect(rows[2].textContent).toContain("2")
        expect(rows[2].textContent).toContain("Ferrari")
    })

    it("keeps the skeleton visible when the standings response is not ok", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: false,
            json: vi.fn(),
        }))

        render(<TeamStandings />)

        await waitFor(() => expect(screen.getByTestId("table-skeleton")).toBeTruthy())
        expect(screen.queryByText("TEAM STANDINGS")).toBeNull()
    })

    it("clears the polling interval when unmounted", () => {
        vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>(() => {})))
        const setIntervalSpy = vi.spyOn(globalThis, "setInterval")
        const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval")

        const { unmount } = render(<TeamStandings />)

        expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 60000)
        unmount()
        expect(clearIntervalSpy).toHaveBeenCalled()
    })
})