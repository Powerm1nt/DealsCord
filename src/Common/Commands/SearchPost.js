const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const makePost = require('../Embeds/VintedPost')
const { createPostCollection, VintedPost } = require('../Embeds/VintedPost')
const vinted = require('@powerm1nt/vinted-api')

const searchCommand = new SlashCommandBuilder()
  .setName('search')
  .setDescription('Search for a vinted post')
  .addStringOption(option =>
    option
      .setName('keywords')
      .setDescription('Keywords to search for')
      .setRequired(true)
  )
module.exports = {
  data: searchCommand,
  async execute (interaction) {
    await vinted.fetchCookie()
      .then(async (data) => {
        await vinted.search(`https://www.vinted.fr/vetements?search_text=${interaction.options.getString('keywords')}?page=1`).then(async (data) => {
          const vintedPosts = data.items
          await new VintedPost().makePost(interaction, vintedPosts)
        })
      })
  }
}
