/* eslint-disable import/first */
import Logger from '../logger/Logger'
// @ts-ignore
global.logger = new Logger(process.env.MISCORD_LOG_LEVEL ?? 'info')
import sendError, { reportError } from '../error'
import { initSentry } from '../error/sentry'
import gzipOldLogs from '../logger/gzipOldLogs'
import inject from '../logger/inject'
import getConfig from '../config/getConfig'
import miscord from '../index'

export default function launch (): void {
  logger.success(`Worker process ${process.pid} started.`)
  initSentry()
  const dataPath = process.env.DATA_PATH !== 'undefined' ? process.env.DATA_PATH : undefined

  async function launch (): Promise<void> {
    if (!process.env.STORAGE_URL) await gzipOldLogs(dataPath)
  }

  launch()
    .then(() => inject(dataPath))
    .then(() => getConfig(dataPath))
    .then(miscord)
    .catch(err => sendError(err))

  const catchError = (error: Error): void => {
    if (!error) return
    sendError(error).catch(err => reportError(err))
  }

  // @ts-ignore
  process.on('unhandledRejection', catchError)
  process.on('uncaughtException', catchError)
}
