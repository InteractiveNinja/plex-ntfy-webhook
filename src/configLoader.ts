import 'dotenv/config';
import { Logger } from './Logger';
import {
  Configuration,
  ConfigurationKeys,
  hasAllRequiredConfigurationKeys,
  requiredConfigurationKeys,
} from './interface/configuration';
import { Service } from 'typedi';
import _ from 'lodash';

@Service()
export class ConfigLoader {
  private readonly configuration: Configuration;

  constructor(private readonly logger: Logger) {
    const { NTFY_URL, NTFY_TOPIC, NTFY_TOKEN, POSTER_TOKEN, PORT, IGNORE_SSL_CERT } = this.buildConfiguration();
    this.configuration = {
      NTFY_TOPIC,
      NTFY_URL,
      NTFY_TOKEN,
      POSTER_TOKEN,
      PORT,
      IGNORE_SSL_CERT,
    };
  }

  public getConfigration(): Configuration {
    return this.configuration;
  }

  private buildConfiguration(): Configuration {
    const envValues = process.env;
    const envConfiguration: Partial<Configuration> = _.values(ConfigurationKeys).reduce(
      (previousValue, currentValue) => {
        return { ...previousValue, [currentValue]: envValues[currentValue] };
      },
      {}
    );

    if (!hasAllRequiredConfigurationKeys(envConfiguration)) {
      const undefinedConfigurations = _.entries(envConfiguration)
        .filter(([, value]) => _.isUndefined(value))
        .map(([key]) => key);
      const missingKeys = requiredConfigurationKeys.filter((key) => undefinedConfigurations.includes(key));
      this.logger.error(`Missing Configuration, please check configuration. Missing Keys: ${missingKeys.join(',')}`);
    }
    return envConfiguration;
  }
}
