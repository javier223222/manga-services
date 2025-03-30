import app from './server';
import {config} from "./config/env"

app.listen(config.port, () => {
  console.log(`Manga Service running on port ${config.port}`);
});
