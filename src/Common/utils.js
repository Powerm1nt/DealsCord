const printAlertError = (alert, error) => {
  console.error('-------- [ERROR] --------')
  console.error('An error occurred:', error)
  console.error('Alert ID: ' + alert.id)
  console.error('Alert Name: ' + alert.name)
  console.error('Channel ID: ' + alert.channelId)
  console.error('Guild ID: ' + alert.guildId)
  console.error('User ID: ' + alert.userId)
  console.error('-------------------------')
}

module.exports = { printAlertError }
