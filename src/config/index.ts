import developmentConfig from './development';
import productionConfig from './production';

/**
 * Determine which environment configuration to use
 */
const env = process.env.NODE_ENV || 'development';

/**
 * Export the configuration for the current environment
 */
const config = env === 'production' ? productionConfig : developmentConfig;

export default config;
