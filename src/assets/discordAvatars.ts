export default {
	blurple: 'https://cdn.discordapp.com/embed/avatars/0.png',
	grey: 'https://cdn.discordapp.com/embed/avatars/1.png',
	green: 'https://cdn.discordapp.com/embed/avatars/2.png',
	yellow: 'https://cdn.discordapp.com/embed/avatars/4.png',
	red: 'https://cdn.discordapp.com/embed/avatars/5.png',
	fuchsia: 'https://cdn.discordapp.com/embed/avatars/6.png',
	fromId(id: string) {
		return `https://cdn.discordapp.com/embed/avatars/${parseInt(id) % 7}.png`
	}
}
