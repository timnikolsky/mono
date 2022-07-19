import { Command } from '@base/Command'
import { ErrorEmbed, SuccessEmbed } from '@base/Embed'
import MonoGuild from '@base/discord.js/Guild'
import { MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import { CommandOptionTypes } from '../../enums'
import RolesModule from '@modules/Roles'
import { Role } from 'discord.js'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'autorole',
			options: [{
				id: 'set',
				type: CommandOptionTypes.SUB_COMMAND,
				options: [{
					id: 'role',
					type: CommandOptionTypes.ROLE,
					required: true
				}]
			}, {
				id: 'disable',
				type: CommandOptionTypes.SUB_COMMAND
			}],
			userPermissionsRequired: ['ManageGuild'],
			module: 'roles'
		})
	}

	async execute({ interaction, t }: CommandContext, options: CommandOptions) {
		if(options.subCommand === 'set') {
			if(options.role!.managed) {
				await interaction.reply({
					embeds: [new ErrorEmbed(t('managedRole'))]
				})
				return
			}

			if(
				!options.role?.managed
				&& !this.guild.members.me!.permissions.has('ManageRoles')
				&& this.guild.members.me!.roles.highest.comparePositionTo(options.role!) > 0
			) {
				await interaction.reply({
					embeds: [new ErrorEmbed(t('cantAccessRole'))]
				})
				return
			}

			await (interaction.guild as MonoGuild).modules.roles.setRoleId(options.role!.id)
			await interaction.reply({
				embeds: [new SuccessEmbed(t('autoroleChanged', { newAutorole: options.role }))]
			})
			return
		}
		if(options.subCommand === 'disable') {
			await (interaction.guild as MonoGuild).modules.roles.setRoleId(null)
			await interaction.reply({
				embeds: [new SuccessEmbed(t('commands:autorole.disabled'))]
			})
			return
		}
	}
}

interface CommandOptions {
	subCommand: 'set' | 'disable',
	role?: Role
}
