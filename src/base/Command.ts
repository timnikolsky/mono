import { CommandData, CommandOption, GuildModules } from '../typings'
import { PermissionResolvable } from 'discord.js'
import Mono from '@base/Mono'
import MonoGuild from '@base/discord.js/Guild'
import CommandContext from '@base/CommandContext'
import Module from '@base/Module'
import { CommandOptionTypes } from '../enums'

export class Command {
	client!: Mono
	guild!: MonoGuild
	id!: string
	options: CommandOption[]
	botPermissionsRequired?: PermissionResolvable[]
	userPermissionsRequired?: PermissionResolvable[]
	module?: keyof GuildModules
	disabledGlobally!: boolean
	autocomplete?: (input: number | string) => Promise<{ name: string, value: number | string }[]>

	constructor(guild: MonoGuild, data: CommandData) {
		this.client = guild.client as Mono
		this.guild = guild
		this.id = data.id
		this.options = data.options
		this.botPermissionsRequired = data.botPermissionsRequired
		this.userPermissionsRequired = data.userPermissionsRequired
		this.disabledGlobally = !!data.disabledGlobally
		this.module = data.module
		this.autocomplete = data.autocomplete
	}

	// Just for typing
	async execute(context: CommandContext, options: any) {}

	get hasSubcommands() {
		return this.options.some(option => option.type === CommandOptionTypes.SUB_COMMAND)
	}

	get hasSubcommandGroups() {
		return this.options.some(option => option.type === CommandOptionTypes.SUB_COMMAND_GROUP)
	}
}
