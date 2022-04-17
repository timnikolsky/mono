import chalk, { BackgroundColor, Color } from 'chalk'
import { ForegroundColor } from 'chalk'

export default class Console {
	static log(text: string) {
		console.log(chalk.white.bgGray(' Log     ') + ' ' + text)
	}
	static success(text: string) {
		console.log(chalk.black.bgGreen(' Success ') + ' ' + text)
	}
	static warning(text: string) {
		console.log(chalk.black.bgYellow(' Warning ') + ' ' + text)
	}
	static error(text: string) {
		console.log(chalk.black.bgRed(' Error   ') + ' ' + text)
	}
	static info(text: string) {
		console.log(chalk.black.bgBlue(' Info    ') + ' ' + text)
	}
	static event(text: string) {
		console.log(chalk.black.bgMagenta(' Event   ') + ' ' + text)
	}
	static action(text: string) {
		console.log(chalk.black.bgCyan(' Action  ') + ' ' + text)
	}
}
