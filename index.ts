import { google } from "googleapis";
import { Game } from "./src/types";
import { createEvent } from "./src/createEvent";
import { readFileSync } from "fs";
/*
import { parsePDF } from "./parsePDF";
import { Week } from "./types";
const filterGamesForTeam = (teamName: string, schedule: Week[]) => {
    return schedule
        .map((s) => s.games)
        .flat()
        .filter(
            (game) => game.homeTeam === teamName || game.awayTeam === teamName
        );
};

const scheduleData = await parsePDF("./schedule.pdf");
const schedule = buildSchedule(scheduleData);
const games = filterGamesForTeam("7 The Other Team", schedule);

const existingEvents = await calendarApi.events.list({
    calendarId: CALENDAR_ID,
    timeMin: new Date().toISOString(),
});

const now = new Date();
const futureGames = games.filter((g) => g.date > now);
const events = futureGames.map(createEvent);
console.log(games);
*/

const games: Game[] = [
    {
        // Week 1 - Game 1v6
        homeTeam: "1. SD Tsunami",
        awayTeam: "6. The Other Team",
        date: new Date("2025-01-27T20:05:00-08:00"), // 8:05pm Pacific
        rink: "E",
    },
    {
        // Week 2 - Game 2v3
        homeTeam: "6. The Other Team",
        awayTeam: "4. Mavin Misfits",
        date: new Date("2025-02-03T20:05:00-08:00"), // 8:05pm Pacific
        rink: "E",
    },
    {
        // Week 3 - Game 6v2
        homeTeam: "6. The Other Team",
        awayTeam: "2. Koho Cup Legends",
        date: new Date("2025-02-10T21:00:00-08:00"), // 9:00pm Pacific
        rink: "E",
    },
    {
        // Week 4 - Game 5v6
        homeTeam: "5. The Royals",
        awayTeam: "6. The Other Team",
        date: new Date("2025-02-17T21:00:00-08:00"), // 9:00pm Pacific
        rink: "E",
    },
    {
        // Week 5 - Game 3v6
        homeTeam: "3. Dangleberries",
        awayTeam: "6. The Other Team",
        date: new Date("2025-02-24T19:10:00-08:00"), // 7:10pm Pacific
        rink: "E",
    },
    {
        // Week 6 - Game 6v1
        homeTeam: "6. The Other Team",
        awayTeam: "1. SD Tsunami",
        date: new Date("2025-03-03T19:10:00-08:00"), // 7:10pm Pacific
        rink: "E",
    },
    {
        // Week 7 - Game 4v6
        homeTeam: "4. Mavin Misfits",
        awayTeam: "6. The Other Team",
        date: new Date("2025-03-10T18:15:00-07:00"), // 6:15pm Pacific (DST starts)
        rink: "E",
    },
    {
        // Week 8 - Game 2v6
        homeTeam: "2. Koho Cup Legends",
        awayTeam: "6. The Other Team",
        date: new Date("2025-03-17T18:15:00-07:00"), // 6:10pm Pacific
        rink: "E",
    },
    {
        // Week 9 - Game 6v5
        homeTeam: "6. The Other Team",
        awayTeam: "5. The Royals",
        date: new Date("2025-03-24T20:05:00-07:00"), // 8:05pm Pacific
        rink: "E",
    },
    {
        // Week 10 - Game 6v3
        homeTeam: "6. The Other Team",
        awayTeam: "3. Dangleberries",
        date: new Date("2025-03-31T20:05:00-07:00"), // 8:05pm Pacific
        rink: "E",
    },
];

const events = games.map(createEvent);

const CALENDAR_ID =
    "50da81cf1a27d87f9dfe721f9f0b0b5375bd94524c11b68c3580afa177cd1966@group.calendar.google.com";

const credentials = JSON.parse(readFileSync("./google-creds.json", "utf8"));
const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendarApi = google.calendar({ version: "v3", auth });

for (const event of events) {
    console.log(event);
    /*
    await calendarApi.events.insert({
        calendarId: CALENDAR_ID,
        requestBody: event,
    });
    */
}
