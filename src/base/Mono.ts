import { Client, ClientOptions, Attachment, TextChannel } from 'discord.js'
import { PrismaClient } from '@prisma/client'
import * as config from '../config'
import glob from 'glob'
import Listener from '@base/Listener'
import * as modules from '../modules'
import i18next, { TFunction } from 'i18next'
import { MonoCommand } from '@typings/index'
import MiddlewareManager from '@base/MiddlewareManager'

export default class Mono extends Client {
	public database = new PrismaClient({
		datasources: {
			db: {
				url: process.env.DATABASE_URL
			}
		}
	})
	public commands: (typeof MonoCommand)[] = []
	public config = config
	public modules = modules
	public middlewareManager = new MiddlewareManager()
	public version = require('../../package.json').version
	public locales: { [x: string]: TFunction } = {
		en: i18next.getFixedT('en'),
		ru: i18next.getFixedT('ru')
	}

	constructor(options: ClientOptions) {
		super(options)
	}

	async launch() {
		await this.login()

		const listenerPaths = glob.sync('src/listeners/**/*.{ts,js}')
		listenerPaths.forEach(path => {
			const listener = require(`$../../../${path}`).default as Listener
			this.on(listener.event, async (...args) => {
				await listener.run(this, ...args)
			})
		})

		const commandPaths = glob.sync('src/commands/**/*.{ts,js}')
		commandPaths.forEach(path => {
			const command = require(`$../../../${path}`).default
			this.commands.push(command)
		})
	}

	async uploadImage(buffer: Buffer, fileName?: string) {
		const imageMessage = await (await this.channels.fetch(process.env.IMAGES_CHANNEL!) as TextChannel).send({
			files: [new Attachment(buffer, fileName)]
		})
		return imageMessage.attachments.first()!.url
	}

	get languages(): string[] {
		return glob.sync('locales/*').map(localePath => localePath.split('/')[1])
	}
}
