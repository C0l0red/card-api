import { ConfigService } from "../config/config.service";
import * as fs from 'fs';

fs.writeFileSync(
    "ormconfig.json",
    JSON.stringify(new ConfigService().createTypeOrmOptions(), null, 2)
);
