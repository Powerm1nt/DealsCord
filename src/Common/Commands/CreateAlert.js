const { SlashCommandBuilder } = require('discord.js')

const createCommand = new SlashCommandBuilder()
  .setName('create')
  .setDescription('Create a new vinted post alert')

module.exports = {
  data: createCommand,
  async execute (interaction) {
    await interaction.reply('Pong!')
  }
}
