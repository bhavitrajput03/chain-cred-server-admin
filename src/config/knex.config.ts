import { ConfigModule, ConfigService } from '@nestjs/config';
import knexfile from './knexfile';

export const DBConfigOptions =
  knexfile[process.env.NODE_ENV] || knexfile.development;

export const knexAsyncConfig = {
  imports: [ConfigModule],
  useFactory: () => {
    return {
      config: DBConfigOptions,
    };
  },
  inject: [ConfigService],
};
