import { google } from "googleapis";
import { createEvent } from "./createEvent";
import { readFileSync } from "fs";
import { Game } from "./types";

const CALENDAR_ID =
    "50da81cf1a27d87f9dfe721f9f0b0b5375bd94524c11b68c3580afa177cd1966@group.calendar.google.com";

const credentials = JSON.parse(readFileSync("./google-creds.json", "utf8"));

const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendarApi = google.calendar({ version: "v3", auth });

export const listEvents = async () => {
    const events = await calendarApi.events.list({
        calendarId: CALENDAR_ID,
        timeMin: new Date().toISOString(),
    });
    return events;
};

export const addEventsForGames = async (games: Game[]) => {
    const events = games.map(createEvent);
    for (const event of events) {
        await calendarApi.events.insert({
            calendarId: CALENDAR_ID,
            requestBody: event,
        });
    }
};
