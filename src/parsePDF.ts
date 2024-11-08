import { PDFExtract } from "pdf.js-extract";
import {
    DayOfMonth,
    GameParameters,
    Matchup,
    Team,
    ScheduleData,
    Time,
    Week,
} from "./types";

const NUM_PLAYOFFS_WEEKS = 2;
const YEAR = 2024;

const parseDayOfMonth = (dayOfMonth: string): DayOfMonth => {
    try {
        const [day, month] = dayOfMonth.split("-");

        const dayNumber = parseInt(day);
        if (dayNumber < 1 || dayNumber > 31) {
            throw new Error("Day of month out of bounds.");
        }

        return { day: dayNumber, month };
    } catch (error: unknown) {
        console.error(`Error parsing dayOfMonth: ${dayOfMonth}.`);
        throw error;
    }
};

const parseTeam = (team: string): Team => {
    try {
        const [teamNumberString, name] = team.split(". ");
        const teamNumber = parseInt(teamNumberString);
        return { number: teamNumber, name };
    } catch (error: unknown) {
        console.error(`Error parsing team: ${team}.`);
        throw error;
    }
};

const parseMatchup = (matchup: string): Matchup => {
    try {
        const [homeTeamString, awayTeamString] = matchup.split(" v ");
        const homeTeam = parseInt(homeTeamString);
        const awayTeam = parseInt(awayTeamString);
        return { homeTeam, awayTeam };
    } catch (error: unknown) {
        console.error(`Error parsing matchup: ${matchup}`);
        throw error;
    }
};

const parseTime = (time: string): Time => {
    try {
        const [hoursMinutes, meridiem, rink] = time.split(" ");
        const [hourString, minuteString] = hoursMinutes.split(":");

        if (rink !== "W" && rink !== "E") {
            throw new Error(`Invalid rink value ${rink}`);
        }

        let hour = parseInt(hourString);
        if (meridiem === "pm") {
            hour += 12;
        }

        let minutes = parseInt(minuteString);

        return { hour, minutes, rink };
    } catch (error: unknown) {
        console.error(`Error parsing time: ${time}`);
        throw error;
    }
};

/**
 * Iterate over the PDF lines categorizing each line into one of the following
 * - Game Day Of Month
 * - Game Time
 * - Team Matchup
 * - Team Names
 * - Document Updated Date
 */
const tokenizePDF = async (pdfPath: string): Promise<ScheduleData> => {
    const pdfExtract = new PDFExtract();
    const data = await pdfExtract.extract(pdfPath);

    if (data.pages.length === 0) {
        throw new Error(`The pdf file ${pdfPath} has zero pages.`);
    }
    const page = data.pages[0];

    const daysOfMonths: DayOfMonth[] = [];
    const times: Time[] = [];
    const matchups: Matchup[] = [];
    const teams: Team[] = [];
    let updatedAt: Date | undefined;
    for (const line of page.content) {
        const text = line.str.trim();

        if (text.length === 0) {
            continue;
        }

        // Parse date lines
        if (text.match(/^\d{1,2}-[A-Za-z]{3}/)) {
            daysOfMonths.push(parseDayOfMonth(text));
            continue;
        }
        // Parse time lines
        if (text.match(/^\d{1,2}:\d{2}\s*pm\s*W$/)) {
            times.push(parseTime(text));
            continue;
        }

        // Parse matchup lines
        if (text.match(/^\d+\s*v\s*\d+$/)) {
            matchups.push(parseMatchup(text));
            continue;
        }

        // Parse team line
        if (text.match(/^\d+\.\s+.+$/)) {
            teams.push(parseTeam(text));
            continue;
        }

        // Pasre the updated date
        if (text.match(/^(9|10|[1-9])\/([1-2][0-9]|3[0-1]|[1-9])\/2024$/)) {
            updatedAt = new Date(text);
            continue;
        }
    }

    return {
        updatedAt,
        teams,
        daysOfMonths,
        times,
        matchups,
    };
};

/**
 * Combine categorized lines for a single game into a useful Game data structure.
 */
const createGame = (params: GameParameters) => {
    const { teams, matchup, dayOfMonth, time } = params;

    const homeTeam = teams.find((t) => t.number === matchup.homeTeam);
    const awayTeam = teams.find((t) => t.number === matchup.awayTeam);

    if (!homeTeam || !awayTeam) {
        throw new Error("Error creating game. Team not found.");
    }

    const { day, month } = dayOfMonth;
    const { hour, minutes, rink } = time;

    const date = new Date(`${month} ${day}, ${YEAR} ${hour}:${minutes}:00`);

    return {
        homeTeam: `${homeTeam.number} ${homeTeam.name}`,
        awayTeam: `${awayTeam.number} ${awayTeam.name}`,
        date: date,
        rink,
    };
};

/**
 * Group the categorized lines into Weeks. A Week represents a square on the
 * source PRF. A Week is the week number and all the games played that day.
 * Note: The max columns cannot be determined dynamically.
 */
const buildSchedule = (scheduleData: ScheduleData): Week[] => {
    const { teams, daysOfMonths, times, matchups } = scheduleData;

    const gamesPerSeason = matchups.length;
    const numWeeks = daysOfMonths.length - NUM_PLAYOFFS_WEEKS;
    const gamesPerWeek = gamesPerSeason / numWeeks;

    const maxCols = 4;
    const gamesPerRow = maxCols * gamesPerWeek;

    const schedule: Week[] = [];
    for (let i = 0; i < numWeeks; i++) {
        schedule.push({ weekNumber: i + 1, games: [] });
    }

    const debug = false;

    for (let i = 0; i < gamesPerSeason; i++) {
        const row = Math.floor(i / gamesPerRow);
        const numCols = (row + 1) * maxCols > 10 ? 2 : 4;
        const inc = i % numCols;
        const offset = row === 0 ? 0 : maxCols * row;
        const weekNumber = offset + inc;

        if (debug) {
            console.info("i", i);
            console.info("row", row);
            console.info("numCols", numCols);
            console.info("inc", inc);
            console.info("offset", offset);
            console.info("weekNumber", weekNumber);
            console.info("");
        }

        const week = schedule[weekNumber];

        const game = createGame({
            teams,
            matchup: matchups[i],
            dayOfMonth: daysOfMonths[weekNumber],
            time: times[i],
        });

        week.games.push(game);
    }

    return schedule;
};

export const parsePDF = async (fileName: string) => {
    const tokens = await tokenizePDF(fileName);
    return buildSchedule(tokens);
};
