import chalk, { BackgroundColor, Color } from 'chalk'
import { ForegroundColor } from 'chalk'

export default class Console {
	static log(text: string) {
		console.log(chalk.gray('Log     ') + ' ' + text)
	}
	static success(text: string) {
		console.log(chalk.green('Success ') + ' ' + text)
	}
	static warning(text: string) {
		console.log(chalk.yellow('Warning ') + ' ' + text)
	}
	static error(text: string) {
		console.log(chalk.red('Error   ') + ' ' + text)
	}
	static info(text: string) {
		console.log(chalk.blue('Info    ') + ' ' + text)
	}
	static event(text: string) {
		console.log(chalk.magenta('Event   ') + ' ' + text)
	}
	static action(text: string) {
		console.log(chalk.cyan('Action  ') + ' ' + text)
	}
}
