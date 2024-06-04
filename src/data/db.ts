import Dexie from "dexie";
import { template1 } from "../templates/template1";
import { template2 } from "../templates/template2";
import { template3 } from "../templates/template3";
import { template4 } from "../templates/template4";
import { template5 } from "../templates/template5";
import { template6 } from "../templates/template6";

const templateSeeds = [
  template1,
  template2,
  template3,
  template4,
  template5,
  template6,
];

export const db: Dexie = new Dexie("drawDB");

db.version(5).stores({ diagrams: "++id, lastModified", templates: "++id, custom" });
//@ts-ignore
db.on("populate", (transaction) => transaction.templates.bulkAdd(templateSeeds).catch((e) => console.log(e)));
