import { PinoLoggerOptions } from 'fastify/types/logger'
import pino from 'pino'
export const loggerOpts: PinoLoggerOptions = {
  transport: {
    target: 'pino-pretty',
    options: {
      //   translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
      singleLine: true,
    },
  },
}
export const logger = pino(loggerOpts)
