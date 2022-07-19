import { MiddlewareContext, MiddlewareFunction } from '@typings/index'
import { checkBotPermissions, checkModuleEnabled, checkUserPermissions, convertOptions } from '../middleware'
import { MiddlewareResult } from '../enums'

export default class MiddlewareManager {
	middlewareFunctions: MiddlewareFunction[] = []

	constructor() {
		this.use(checkBotPermissions)
		this.use(checkUserPermissions)
		this.use(checkModuleEnabled)
		this.use(convertOptions)
	}

	private use(middlewareFunction: MiddlewareFunction) {
		this.middlewareFunctions.push(middlewareFunction)
	}

	async handle(context: MiddlewareContext) {
		for(const mwFunction of this.middlewareFunctions) {
			const result = await mwFunction(context)
			if(result === MiddlewareResult.BREAK) return MiddlewareResult.BREAK
		}
		return MiddlewareResult.NEXT
	}
}
