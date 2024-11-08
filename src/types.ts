export type Team = {
    number: number;
    name: string;
};

export type DayOfMonth = {
    month: string;
    day: number;
};

export type Matchup = {
    homeTeam: number;
    awayTeam: number;
};

export type Rink = "W" | "E";

export type Time = {
    hour: number;
    minutes: number;
    rink: Rink;
};

export type ScheduleData = {
    updatedAt: Date | undefined;
    teams: Team[];
    daysOfMonths: DayOfMonth[];
    matchups: Matchup[];
    times: Time[];
};

export type Game = {
    homeTeam: string;
    awayTeam: string;
    date: Date;
    rink: Rink;
};

export type GameParameters = {
    teams: Team[];
    matchup: Matchup;
    dayOfMonth: DayOfMonth;
    time: Time;
};

export type Week = {
    weekNumber: number;
    games: Game[];
};

export type Schedule = Week[]


