export type Driver = {
    driver_number: number,
    meeting_key: number,
    session_key: number,
    broadcast_name: string,
    full_name: string,
    name_acronym: string,
    team_name: string,
    team_colour: string,
    first_name: string,
    last_name: string,
    country_code: string,
    headshot_url: string
}

export type DriverStanding = {
    driver_number: number,
    meeting_key: number,
    session_key: number,
    position_start: number,
    position_current: number,
    points_start: number,
    points_current: number
}

export type TeamStanding = {
    team_name: string,
    meeting_key: number,
    session_key: number,
    position_start: number,
    position_current: number,
    points_start: number,
    points_current: number,
}

export type Meeting = {
    meeting_key: number,
    meeting_name: string,
    meeting_official_name: string,
    location: string,
    country_key: number,
    country_code: string,
    country_name: string,
    country_flag: string,
    circuit_key: number,
    circuit_short_name: string,
    circuit_type: string,
    circuit_info_url: string,
    circuit_image: string,
    gmt_offset: string,
    date_start: string,
    date_end: string,
    year: number,
    is_cancelled: boolean
}

export type SessionResult = {
    driver_number: number,
    position: number,
    number_of_laps: number,
    dnf: boolean,
    dns: boolean,
    dsq: boolean,
    gap_to_leader: string,
    meeting_key: number,
    session_key: number,
    duration: number,
    points: number,
}

export type Session = {
    session_key: number,
    session_type: string,
    session_name: string,
    date_start: string, 
    date_end: string,
    meeting_key: number,
    circuit_key: number,
    circuit_short_name: string,
    country_key: number,
    country_code: string,
    country_name: string, 
    location: string, 
    gmt_offset: string, 
    year: number, 
    is_cancelled: boolean
}

export type DriverSessionResult = {
    driver_number: number,
    position: number,
    number_of_laps: number,
    dnf: boolean,
    dns: boolean,
    dsq: boolean,
    gap_to_leader: string,
    meeting_key: number,
    session_key: number,
    duration: number,
    points: number,
    drivers: Driver

}

export type Countdown = {
    days: string,
    hours: string,
    mins: string,
    secs: string
}
