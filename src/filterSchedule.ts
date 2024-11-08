import { Game, Schedule } from "./types";

export const filterSchedule = (
    teamName: string,
    schedule: Schedule
): Game[] => {
    return schedule
        .map((s) => s.games)
        .flat()
        .filter(
            (game) => game.homeTeam === teamName || game.awayTeam === teamName
        );
};
