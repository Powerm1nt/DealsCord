const fs = require('fs')
const CONFIG_FILE = 'config.json'

class ConfigProvider {
  constructor () {
    this._config = {}
    this.retrieve()
  }

  set (key, value) {
    this._config[key] = value
    return true
  }

  get (key) {
    return this._config[key]
  }

  has (key) {
    // eslint-disable-next-line no-prototype-builtins
    return this._config.hasOwnProperty(key)
  }

  remove (key) {
    delete this._config[key]
    return true
  }

  clear () {
    this._config = {}
    return true
  }

  save () {
    // Save the json config
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(this._config, null, 2)) // TODO Impl locks
    return true
  }

  retrieve () {
    // Retrieve the json config
    if (!fs.existsSync(CONFIG_FILE)) this.save()
    this._config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'))
    return true
  }
}

module.exports = { ConfigProvider }
