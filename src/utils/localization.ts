import { TranslatorFunction } from '@typings/index'

export function getTranslatorFunction(language: string, context?: string): TranslatorFunction {
	return (key: string, parameters: { [x: string]: any } = {}) => {
		const fileName = key.includes(':') // If key overrides file
			? key.split(':')[0]
			: context
				? context.split(':')[0]
				: 'common'

		const locales = require(`../../locales/${language}/${fileName}.json`)

		let path =
			key.split(':')[1]
				? key.split(':')[1].split('.')
				: key.split('.')

		if(context?.includes(':') && !key.includes(':')) {
			path = [...context?.split(':')[1].split('.'), ...path]
		}

		let resultString = locales

		for(let pathKey of path) {
			if(!resultString[pathKey]) return key
			resultString = resultString[pathKey]
		}

		if(typeof resultString !== 'string') return key

		// Replace {{templates}} to values
		resultString = resultString.replace(
			new RegExp('\{{.*?\}}', 'g'),
			(match) => {
				return parameters[match.substring(2, match.length - 2)]
			}
		)

		return resultString
	}
}
