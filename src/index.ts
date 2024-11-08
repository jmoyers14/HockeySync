import { filterSchedule } from "./filterSchedule";
import { parsePDF } from "./parsePDF";

const TEAM_NAME = "7 The Other Team";

const schedule = await parsePDF("./schedule.pdf");
const games = filterSchedule(TEAM_NAME, schedule);

console.log(games);
