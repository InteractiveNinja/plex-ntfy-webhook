import 'dotenv/config';
import { Logger } from './Logger';
import { Configuration } from './interface/configuration';

export class ConfigLoader {
  private static readonly instance = new ConfigLoader();
  private readonly configuration: Configuration;
  private readonly logger = Logger.getLogger();

  private constructor() {
    const { NTFY_URL, NTFY_TOPIC, POSTER_TOKEN, PORT } = process.env;

    if (NTFY_TOPIC != null && NTFY_URL != null && POSTER_TOKEN != null) {
      const port = parseInt(PORT ?? '3000');
      this.configuration = { NTFY_TOPIC, NTFY_URL, POSTER_TOKEN, PORT: port };
    } else {
      const errorMsg = 'Configration is not set. Check .env File';
      this.logger.error(errorMsg);
      throw new Error(errorMsg);
    }
  }

  public static getInstance(): ConfigLoader {
    return this.instance;
  }

  public getConfigration(): Configuration {
    return this.configuration;
  }
}
