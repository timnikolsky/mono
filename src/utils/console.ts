import chalk, { BackgroundColor, Color } from 'chalk'
import { ForegroundColor } from 'chalk'

export default class Console {
	static log(...message: any[]) {
		console.log(chalk.gray('log     '), ...message)
	}
	static success(...message: any[]) {
		console.log(chalk.green('success '), ...message)
	}
	static warning(...message: any[]) {
		console.log(chalk.yellow('warning '), ...message)
	}
	static error(...message: any[]) {
		console.log(chalk.red('error   '), ...message)
	}
	static info(...message: any[]) {
		console.log(chalk.blue('info    '), ...message)
	}
	static event(...message: any[]) {
		console.log(chalk.magenta('event   '), ...message)
	}
	static action(...message: any[]) {
		console.log(chalk.cyan('action  '), ...message)
	}
}