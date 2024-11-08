import { google } from "googleapis";
import { readFileSync } from "fs";
import { createEvent } from "./createEvent";
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

const CALENDAR_ID =
    "50da81cf1a27d87f9dfe721f9f0b0b5375bd94524c11b68c3580afa177cd1966@group.calendar.google.com";

const credentials = JSON.parse(readFileSync("./google-creds.json", "utf8"));

const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendarApi = google.calendar({ version: "v3", auth });

const existingEvents = await calendarApi.events.list({
    calendarId: CALENDAR_ID,
    timeMin: new Date().toISOString(),
});

const now = new Date();
const futureGames = games.filter((g) => g.date > now);
const events = futureGames.map(createEvent);
console.log(games);

/*
for (const event of events) {
    await calendarApi.events.insert({
        calendarId: CALENDAR_ID,
        requestBody: event,
    });
}
*/
