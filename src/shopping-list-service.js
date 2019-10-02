const ShoppingListService = {
  getAllItems(knex) {
    return knex.select('*').from('shopping_list');
  },
  createItem(knex, newItem) {
    return knex
      .insert(newItem)
      .into('shopping_list')
      .returning('*')
      .then( res => res[0]);
  },
  getItemById(knex, id) {
    return knex
      .select('*')
      .from('shopping_list')
      .where({ id })
      .first();
  },
  deleteItem(knex, id) {
    return knex('shopping_list')
      .where( {id} )
      .delete();
  },
  updateItem(knex, id, newData) {
    return knex
      .from('shopping_list')
      .where( {id} )
      .update(newData);
  }
};

module.exports = ShoppingListService;