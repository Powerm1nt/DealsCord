const { SlashCommandBuilder } = require('discord.js')
const makePost = require('../Embeds/VintedPost')
const { createPost } = require('../Embeds/VintedPost')

const searchCommand = new SlashCommandBuilder()
  .setName('search')
  .setDescription('Search for a vinted post')

module.exports = {
  data: searchCommand,
  async execute (interaction) {
    await createPost(interaction)
  }
}
