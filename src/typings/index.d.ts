import {
	CommandInteraction,
	Interaction, MessageActionRow, MessageActionRowComponent, MessageComponent,
	PermissionFlags,
	PermissionResolvable,
	Role,
	Snowflake,
	User
} from 'discord.js'
import { ApplicationCommandOptionTypes, ChannelTypes } from 'discord.js/typings/enums'
import ModerationModule from '@modules/Moderation'
import StarboardModule from '@modules/Starboard'
import MonoGuild from '@base/discord.js/Guild'
import { TFunction } from 'i18next'
import { Command } from '@base/Command'
import CommandContext from '@base/CommandContext'
import { CommandOptionTypes, MiddlewareResult } from '../enums'
import Module from '@base/Module'
import RolesModule from '@modules/Roles'
import { Embed } from '@base/Embed'
import PrivateRoomsModule from '@modules/PrivateRooms'
import AutoroleModule from '@modules/Autorole'

export interface CommandData {
	id: string,
	options: CommandOption[],
	module?: keyof GuildModules,
	disableable?: boolean,
	botPermissionsRequired?: PermissionResolvable[],
	userPermissionsRequired?: PermissionResolvable[],
	disabledGlobally?: boolean,
	staff?: boolean
	autocomplete?: (input: number | string) => Promise<{ name: string, value: number | string }[]>
}

export class MonoCommand extends Command {
	constructor(guild: MonoGuild)
	execute(context: CommandContext, options: any): Promise<void>
}

export interface CommandOption {
	id: string,
	type: CommandOptionTypes
	choices?: CommandOptionChoice[],
	options?: CommandOption[]
	required?: boolean,
	channelTypes?: ChannelTypes[],
	minValue?: number,
	maxValue?: number,
	autocomplete?: boolean
}

export interface CommandOptionChoice {
	id: string,
	value: string | number
}

export interface CommandContextOptions {
	subCommand: string | null,
	subCommandGroup: string | null,
	[x: string]: any
}

export interface ModuleData {
	enabledDefault: boolean,
	disabledGlobally?: boolean
}

export interface GuildModules {
	moderation: ModerationModule,
	// starboard: StarboardModule,
	roles: RolesModule,
	privateRooms: PrivateRoomsModule
}

export type MiddlewareFunction = (context: MiddlewareContext) => Promise<MiddlewareResult>

export interface MiddlewareContext {
	interaction: CommandInteraction,
	command: Command,
	commandContext: CommandContext,
	commandOptions: CommandContextOptions
}

export type TranslatorFunction = (key: string, parameters?: { [x: string]: any }) => string

export interface CommandReplyPayload {
	content?: string,
	embeds?: Embed[] | Embed,
	ephemeral?: boolean,
	components?: MessageActionRowComponent[][] | MessageActionRowComponent[]
}
