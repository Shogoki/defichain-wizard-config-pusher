/* eslint-disable no-console */
/**
 * Logging an info output to the console.
 * @param text The text to log to the console.
 */
const logInfo = (text: string) => {
  console.log(text);
};

const logInfoPlus = (text: string, variable: Object) => {
  console.log(text, variable);
};

/**
 * Logging an error output to the console.
 *
 * If someone enables to send error to Telegram in the config, it will do that as well.
 *
 * @param text The text to log to the console.
 */
function logError(text: string) {
  console.error(text);
}

/**
 * Logging a debug output to the console.
 * @param text The text to log to the console.
 */
const logDebug = (text: string) => {
  console.log(text);
};

/**
 * Logging a warn output to the console.
 * @param text The text to log to the console.
 */
const logWarn = (text: string) => {
  console.warn(text);
};

export { logInfo, logInfoPlus, logError, logDebug, logWarn };
