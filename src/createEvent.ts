import { Game } from "./types";

export const createEvent = (game: Game) => {
    return {
        summary: `Hockey: ${game.homeTeam} vs ${game.awayTeam}`,
        description: "test",
        start: {
            dateTime: game.date.toISOString(),
            timeZone: "America/Los_Angeles",
        },
        end: {
            dateTime: new Date(
                game.date.getTime() + 60 * 60 * 1000
            ).toISOString(),
            timeZone: "America/Los_Angeles",
        },
        location: "Escondido Sports Center, 3315 Bear Valley Parkway",
        reminders: {
            useDefault: false,
            overrides: [
                { method: "popup", minutes: 120 },
                { method: "popup", minutes: 60 },
            ],
        },
    };
};
