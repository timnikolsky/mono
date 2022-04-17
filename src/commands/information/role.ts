import { Command } from '@base/Command'
import { Embed } from '@base/Embed'
import MonoGuild from '@base/discord.js/Guild'
import { MonoCommand } from '@typings/index'
import CommandContext from '@base/CommandContext'
import { CommandOptionTypes } from '../../enums'
import { Role } from 'discord.js'
import Canvas from 'canvas'
import { formatBoolean, formatTimestamp } from '@utils/formatters'
import axios from 'axios'

export default class extends Command implements MonoCommand {
	constructor(guild: MonoGuild) {
		super(guild, {
			id: 'role',
			options: [{
				id: 'role',
				type: CommandOptionTypes.ROLE,
				required: true
			}]
		})
	}

	async execute({ interaction, t }: CommandContext, options: CommandOptions) {
		const role = interaction.guild?.roles.cache.get(options.role.id)
		if(!role || !interaction.guild) {
			await interaction.reply({
				embeds: [
					new Embed()
						.setDescription('oops')
				]
			})
			return
		}

		const canvas = Canvas.createCanvas(92, 92)
		const context = canvas.getContext('2d')
		// Draw background
		context.fillStyle = role.color ? role.hexColor + '1A' : '#5865F24D'
		context.beginPath();
		context.moveTo(8, 0);
		context.arcTo(92, 0, 92, 92, 8);
		context.arcTo(92, 92, 0, 92, 8);
		context.arcTo(0, 92, 0, 0, 8);
		context.arcTo(0, 0, 92, 0, 8);
		context.closePath();
		context.fill()
		// Draw at symbol
		context.fillStyle = role.color ? role.hexColor : '#FFFFFF'
		context.beginPath();
		context.moveTo(46.5519,75.6135);
		context.bezierCurveTo(52.3807,75.6135,58.5724,74.1365,61.4076,72.6591);
		context.lineTo(59.4796,66.8863);
		context.bezierCurveTo(57.3251,67.7045,52.1084,69.2045,46.9375,69.2045);
		context.bezierCurveTo(31.9231,69.2045,23.8035,61.0682,23.8035,46.341);
		context.bezierCurveTo(23.8035,32.6136,31.5602,23.0455,46.3705,23.0455);
		context.bezierCurveTo(58.459,23.0455,67.463,29.9091,67.4404,42.8183);
		context.bezierCurveTo(67.463,52.2044,66.0116,56.4319,62.3826,56.4319);
		context.bezierCurveTo(60.4549,56.4319,59.321,54.8863,59.2984,52.6365);
		context.lineTo(59.2984,31);
		context.lineTo(52.9704,31);
		context.lineTo(52.9704,33.5455);
		context.lineTo(52.6529,33.5455);
		context.bezierCurveTo(51.9272,31.5455,47.5725,29.7046,42.651,30.3864);
		context.bezierCurveTo(36.3231,31.2273,30.2447,36.4318,30.2447,46.1591);
		context.bezierCurveTo(30.2447,56.1818,35.688,62.0682,43.0818,62.409);
		context.bezierCurveTo(48.2303,62.6591,52.2221,60.3637,53.2879,57.6591);
		context.lineTo(53.5601,57.6591);
		context.bezierCurveTo(54.1043,61.0682,57.0981,62.9319,61.6796,62.6818);
		context.bezierCurveTo(71.4322,62.3181,74.2218,53.5909,74.1992,43.2044);
		context.bezierCurveTo(74.2218,28.2727,64.1973,16.7273,46.5293,16.7273);
		context.bezierCurveTo(27.7045,16.7273,16.75,28.3409,16.7273,46.4319);
		context.bezierCurveTo(16.75,64.9546,27.5231,75.6135,46.5519,75.6135);
		context.closePath();
		context.moveTo(44.9643,55.8863);
		context.bezierCurveTo(39.0447,55.8863,37.0488,51.0682,37.0261,45.8863);
		context.bezierCurveTo(37.0488,40.7046,39.9292,36.9091,45.0095,36.9091);
		context.bezierCurveTo(50.657,36.9091,52.7437,39.6818,52.7663,45.8636);
		context.bezierCurveTo(52.8344,52.4999,50.7023,55.8863,44.9643,55.8863);
		context.closePath();
		context.fill();

		const imageURL = await this.client.uploadImage(canvas.toBuffer())

		// Get color name
		let colorName
		if(role.color) {
			if(role.hexColor === '#5865f2') {
				colorName = 'Blurple'
			} else {
				colorName = ((await axios.get(`https://api.color.pizza/v1/${role.hexColor.replace('#', '')}`)) as any).data.colors[0].name
			}
		}

		if(role.id === role.guild.roles.everyone.id) {
			await interaction.reply({
				embeds: [
					new Embed()
						.setTitle(`@everyone`)
						.setThumbnail(imageURL)
						.addField(
							t('common:id'),
							'`' + role.id + '`',
							true
						)
						.addField(
							t('mentionable'),
							formatBoolean(t, role.mentionable),
							true
						)
						.addField(
							t('permissions'),
							role.permissions.toArray().includes('ADMINISTRATOR') ?
								`\`${t(`common:permissions.ADMINISTRATOR`)}\`` :
								role.permissions.toArray()
									.map(p => `\`${t(`common:permissions.${p}`)}\``)
									.join(', ') || t('common:none'),
							false
						)
				]
			})
			return
		}
		await interaction.reply({
			embeds: [
				new Embed()
					.setTitle(`@${role.name}`)
					.setThumbnail(imageURL)
					.addField(
						t('common:id'),
						'`' + role.id + '`',
						true
					)
					.addField(
						t('common:color'),
						role.color ? colorName + '\n`' + role.hexColor.toUpperCase() + '`' : t('common:none'),
						true
					)
					.addField(
						t('position'),
						role.position.toString(),
						true
					)
					.addField(
						t('hoist'),
						formatBoolean(t, role.hoist),
						true
					)
					.addField(
						t('mentionable'),
						formatBoolean(t, role.mentionable),
						true
					)
					.addField(
						t('created'),
						formatTimestamp(role.createdTimestamp),
						true
					)
					.addField(
						t('permissions'),
						role.permissions.toArray().includes('ADMINISTRATOR') ?
							`\`${t(`common:permissions.ADMINISTRATOR`)}\`` :
							role.permissions.toArray()
								.filter(n => !interaction.guild?.roles.everyone.permissions.toArray().includes(n))
								.map(p => `\`${t(`common:permissions.${p}`)}\``)
								.join(', ') || t('common:none'),
						true
					)
			]
		})
	}
}

interface CommandOptions {
	role: Role
}
