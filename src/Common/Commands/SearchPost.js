const { SlashCommandBuilder } = require('discord.js')
const vinted = require('@powerm1nt/vinted-api')
const { VintedPost } = require('../Embeds/VintedPost')

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
          await new VintedPost().makePost(interaction, data.items)
        })
      })
  }
}
