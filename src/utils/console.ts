import chalk, { BackgroundColor, Color } from 'chalk'
import { ForegroundColor } from 'chalk'

export default class Console {
	/** Use this for debugging */
	static log(...message: any[]) {
		console.log(chalk.gray('log     '), ...message)
	}
	/** Use when action, taken by a bot, was successful */
	static success(...message: any[]) {
		console.log(chalk.green('success '), ...message)
	}
	/** Use when there's something that should be considered, but not fatal */
	static warning(...message: any[]) {
		console.log(chalk.yellow('warning '), ...message)
	}
	/** Use when some action failed, but didn't affect bot  */
	static failure(...message: any[]) {
		console.log(chalk.redBright('failure '), ...message)
	}
	/** Use when something bad actually happened */
	static error(...message: any[]) {
		console.log(chalk.bgRed.whiteBright(' error  '), ...message)
		console.trace()
	}
	/** Use for regular actions descriptions */
	static info(...message: any[]) {
		console.log(chalk.blue('info    '), ...message)
	}
	/** Use when something happened outside */
	static event(...message: any[]) {
		console.log(chalk.magenta('event   '), ...message)
	}
}