import React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import getCurrentCountdown from "@/lib/getCurrentCountdown"
import NextSessionCard from "./NextSessionCard"

vi.mock("@/lib/getCurrentCountdown", () => ({
    default: vi.fn(() => ({ days: "02", hours: "03", mins: "04", secs: "05" })),
}))

vi.mock("./NextSessionCardSkeleton", () => ({
    default: () => <div data-testid="session-card-skeleton">Loading session</div>,
}))

const nextSession = {
    session_key: 1,
    session_type: "Practice",
    session_name: "Practice 1",
    date_start: "2026-12-01T10:00:00Z",
    date_end: "2026-12-01T11:00:00Z",
    meeting_key: 1,
    circuit_key: 1,
    circuit_short_name: "Bahrain",
    country_key: 1,
    country_code: "BHR",
    country_name: "Bahrain",
    location: "Sakhir",
    gmt_offset: "+03:00",
    year: 2026,
    is_cancelled: false,
}

describe("NextSessionCard", () => {
    beforeEach(() => {
        vi.restoreAllMocks()
        vi.mocked(getCurrentCountdown).mockReturnValue({
            days: "02",
            hours: "03",
            mins: "04",
            secs: "05",
        })
    })

    afterEach(() => {
        cleanup()
        vi.unstubAllGlobals()
    })

    it("shows the skeleton while session data is loading", () => {
        vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>(() => {})))

        render(<NextSessionCard />)

        expect(screen.getByTestId("session-card-skeleton")).toBeTruthy()
    })

    it("fetches and displays the next session and countdown", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(nextSession),
        })
        vi.stubGlobal("fetch", fetchMock)

        render(<NextSessionCard />)

        await waitFor(() => expect(screen.getByText("Bahrain Practice 1")).toBeTruthy())

        expect(fetchMock).toHaveBeenCalledWith("/api/session/next")
        expect(screen.getByText("NEXT SESSION")).toBeTruthy()
        expect(screen.getByText("02")).toBeTruthy()
        expect(screen.getByText("03")).toBeTruthy()
        expect(screen.getByText("04")).toBeTruthy()
        expect(screen.getByText("05")).toBeTruthy()
        expect(screen.queryByTestId("session-card-skeleton")).toBeNull()
    })

    it("displays the live state when the session is already underway", async () => {
        vi.mocked(getCurrentCountdown).mockReturnValue(null)
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(nextSession),
        }))

        render(<NextSessionCard />)

        await waitFor(() => expect(screen.getByText("CURRENT SESSION")).toBeTruthy())

        expect(screen.getByText("LIVE NOW")).toBeTruthy()
        expect(screen.queryByText("DAYS")).toBeNull()
    })

    it("keeps the skeleton visible when the session response is not ok", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: false,
            json: vi.fn(),
        }))

        render(<NextSessionCard />)

        await waitFor(() => expect(screen.getByTestId("session-card-skeleton")).toBeTruthy())
        expect(screen.queryByText("NEXT SESSION")).toBeNull()
    })
})
