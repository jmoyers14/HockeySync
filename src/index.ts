import { filterSchedule } from "./filterSchedule";
import { parsePDF } from "./parsePDF";

const schedule = await parsePDF("./schedule.pdf");
const games = filterSchedule("7 The Other Team", schedule);


console.log(games)




