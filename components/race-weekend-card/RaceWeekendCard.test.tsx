import React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import RaceWeekendCard from "./RaceWeekendCard"

vi.mock("next/image", () => ({
    default: ({
        alt,
        src,
        width,
        height,
    }: {
        alt: string
        src: string
        width: number
        height: number
    }) => <img alt={alt} src={src} width={width} height={height} />
}))
vi.mock("./RaceWeekendCardSkeleton", () => ({
    default: () => <div data-testid="race-weekend-skeleton">Loading race weekend</div>
}))
vi.mock("./RaceWeekendCardError", () => ({
    default: () => <div data-testid="race-weekend-err">Error loading race weekend</div>,
}))

const futureStart = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
const pastStart = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

const createMeeting = (dateStart: string) => ({
    meeting_key: 1,
    meeting_name: "Bahrain Grand Prix",
    meeting_official_name: "2026 Bahrain Grand Prix",
    location: "Sakhir",
    country_key: 1,
    country_code: "BHR",
    country_name: "Bahrain",
    country_flag: "/bahrain-flag.png",
    circuit_key: 1,
    circuit_short_name: "Bahrain",
    circuit_type: "Permanent",
    circuit_info_url: "",
    circuit_image: "/bahrain-circuit.png",
    gmt_offset: "+03:00",
    date_start: dateStart,
    date_end: new Date(new Date(dateStart).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    year: 2026,
    is_cancelled: false,
})

const sessions = [
    { session_name: "Practice 1", date_start: futureStart },
    { session_name: "Qualifying", date_start: futureStart },
]

describe("RaceWeekendCard", () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    afterEach(() => {
        cleanup()
        vi.unstubAllGlobals()
    })

    it("shows the skeleton while race weekend data is loading", () => {
        vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>(() => {})))

        render(<RaceWeekendCard />)

        expect(screen.getByTestId("race-weekend-skeleton")).toBeTruthy()
    })

    it("fetches and displays the upcoming race weekend and sessions", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                meetingData: createMeeting(futureStart),
                sessions,
            }),
        })
        vi.stubGlobal("fetch", fetchMock)

        render(<RaceWeekendCard />)

        await waitFor(() => expect(screen.getByText("2026 Bahrain Grand Prix")).toBeTruthy())

        expect(fetchMock).toHaveBeenCalledWith("/api/race-weekend/latest")
        expect(screen.getByText("NEXT RACE WEEKEND")).toBeTruthy()
        expect(screen.getByText(/Upcoming/)).toBeTruthy()
        expect(screen.getByRole("img", { name: "Bahrain flag" })).toBeTruthy()
        expect(screen.getByRole("img", { name: "Bahrain circuit" })).toBeTruthy()
        expect(screen.queryByText("Practice 1")).toBeNull()

        fireEvent.click(screen.getByText("NEXT RACE WEEKEND"))

        expect(screen.getByText("Practice 1")).toBeTruthy()
        expect(screen.getByText("Qualifying")).toBeTruthy()
        expect(screen.queryByTestId("race-weekend-skeleton")).toBeNull()
    })

    it("shows the live state for the current race weekend", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
                meetingData: createMeeting(pastStart),
                sessions,
            }),
        }))

        render(<RaceWeekendCard />)

        await waitFor(() => expect(screen.getByText("CURRENT RACE WEEKEND")).toBeTruthy())

        expect(screen.getByText(/Live/)).toBeTruthy()
    })

    it("displays error when the race weekend response is not ok", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: false,
            json: vi.fn(),
        }))

        render(<RaceWeekendCard />)

        await waitFor(() => expect(screen.getByTestId("race-weekend-err")).toBeTruthy())
        expect(screen.queryByText("NEXT RACE WEEKEND")).toBeNull()
    })
})
