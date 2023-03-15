class VintedDataProvider {
  constructor () {
    this._api = new VintedApi()
  }

  async getItems () {
    const items = await this._api.getItems()
    return items.map(item => new Item(item))
  }

  async getCategories () {
    const categories = await this._api.getCategories()
    return categories.map(category => new Category(category))
  }
}
