import React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import LastSessionCard from "./LastSessionCard"

vi.mock("../TableSkeleton", () => ({
    default: () => <div data-testid="table-skeleton">Loading results</div>
}))
vi.mock("./LastSessionCardError", () => ({
    default: () => <div data-testid="last-session-err">Error loading last session</div>
}))

const driver = {
    driver_number: 4,
    meeting_key: 1,
    session_key: 1,
    broadcast_name: "L NORRIS",
    full_name: "Lando Norris",
    name_acronym: "NOR",
    team_name: "McLaren",
    team_colour: "FF8000",
    first_name: "Lando",
    last_name: "Norris",
    country_code: "GBR",
    headshot_url: "",
}

const raceResults = [
    {
        driver_number: 4,
        position: 1,
        number_of_laps: 57,
        dnf: false,
        dns: false,
        dsq: false,
        gap_to_leader: "",
        meeting_key: 1,
        session_key: 1,
        duration: 5400.123,
        points: 25,
        drivers: driver,
    },
    {
        driver_number: 16,
        position: 2,
        number_of_laps: 57,
        dnf: false,
        dns: false,
        dsq: false,
        gap_to_leader: "1.234",
        meeting_key: 1,
        session_key: 1,
        duration: 5401.357,
        points: 18,
        drivers: { ...driver, driver_number: 16, full_name: "Charles Leclerc", last_name: "Leclerc" },
    },
]

describe("LastSessionCard", () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    afterEach(() => {
        cleanup()
        vi.unstubAllGlobals()
    })

    it("shows a skeleton while session results are loading", () => {
        vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>(() => {})))

        render(<LastSessionCard />)

        expect(screen.getByTestId("table-skeleton")).toBeTruthy()
    })

    it("fetches and displays race results with formatted times and points", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                sessionInfo: { name: "Bahrain Grand Prix", session_type: "race" },
                mergedSessionData: raceResults,
            }),
        })
        vi.stubGlobal("fetch", fetchMock)

        render(<LastSessionCard />)

        await waitFor(() => expect(screen.getByText("Bahrain Grand Prix")).toBeTruthy())

        expect(fetchMock).toHaveBeenCalledWith("/api/session-results/latest")
        expect(screen.getByText("LAST SESSION")).toBeTruthy()
        expect(screen.getByText("Time")).toBeTruthy()
        expect(screen.getByText("Points")).toBeTruthy()
        expect(screen.getByText("Lando Norris")).toBeTruthy()
        expect(screen.getByText("1:30:00.123")).toBeTruthy()
        expect(screen.getByText("+1.234")).toBeTruthy()
        expect(screen.getByText("25")).toBeTruthy()
        expect(screen.getByText("18")).toBeTruthy()
        expect(screen.queryByTestId("table-skeleton")).toBeNull()
    })

    it("shows laptime and laps for qualifying sessions", async () => {
        const qualifyingResult = {
            ...raceResults[0],
            number_of_laps: 3,
            duration: 82.345
        }
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                sessionInfo: { name: "Qualifying", session_type: "qualifying" },
                mergedSessionData: [qualifyingResult],
            }),
        }))

        render(<LastSessionCard />)

        await waitFor(() => expect(screen.getByText("Qualifying")).toBeTruthy())

        expect(screen.getByText("Laptime")).toBeTruthy()
        expect(screen.getByText("Laps")).toBeTruthy()
        expect(screen.getByText("1:22.345")).toBeTruthy()
        expect(screen.getByText("1")).toBeTruthy()
        expect(screen.getByText("3")).toBeTruthy()
        expect(screen.queryByText("Points")).toBeNull()
    })

    it("shows a delayed-data message when the latest session has no results", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                sessionInfo: { name: "Monaco Grand Prix", session_type: "race" },
                mergedSessionData: [],
            }),
        }))

        render(<LastSessionCard />)

        await waitFor(() => expect(screen.getByText("Awaiting latest session data...")).toBeTruthy())

        expect(screen.getByText("Data may be delayed by ~2.5 hours due to OpenF1 processing.")).toBeTruthy()
    })

    it("displays error when the response is not ok", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: false,
            json: vi.fn(),
        }))

        render(<LastSessionCard />)

        await waitFor(() => expect(screen.getByTestId("last-session-err")).toBeTruthy())
        expect(screen.queryByText("LAST SESSION")).toBeNull()
    })
})
