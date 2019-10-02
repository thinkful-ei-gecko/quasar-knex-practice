const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');

describe('Shopping List Service Object', () => {
  let db;
  let testList = [
    {
      id:1,
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      name: 'first item',
      category: 'Main',
      price: '13.00', 
      checked: false
    },
    {
      id:2,
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      name: 'Second item!',
      category: 'Main',
      price: '14.00', 
      checked: false
    },
    {
      id:3,
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      name: 'Third item!',
      category: 'Snack',
      price: '15.24', 
      checked: true
    },
  ];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });

  before(() => db('shopping_list').truncate());

  afterEach(() => db('shopping_list').truncate());

  after(() => db.destroy());

  context('Given \'shopping_list\' has data', () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testList);
    });

    it('getAllItems() should resolve all items from \'shopping_list\' table ', () => {
      return ShoppingListService.getAllItems(db)
        .then( list => {
          expect(list).to.eql(testList);
        });
    });

    it('getItemById() should resolve item by id from \'shopping_list\' table', () => {
      const itemID = 2;
      return ShoppingListService.getItemById(db, itemID)
        .then( res => {
          expect(res).to.eql(testList[itemID - 1]);
        });
    });

    it('deleteItem() should remove item by ID from \'shopping_list\' table', () => {
      const itemID = 2;
      return ShoppingListService.deleteItem(db, itemID) 
        .then( () => ShoppingListService.getAllItems(db))
        .then( allItems => {
          const expected = testList.filter( item => item.id !== itemID);
          expect(allItems).to.eql(expected);
        });
    });

    it('updateItem() should update item by ID from \'shopping_list\' table', () => {
      const itemID = 2;
      const newProperties = {
        name:'new name',
        price: '222.00',
        category: 'Breakfast',
        checked: true
      };
      return ShoppingListService.updateItem(db, itemID, newProperties)
        .then( () => ShoppingListService.getItemById(db, itemID))
        .then( item => {
          expect(item).to.eql( {
            id: itemID,
            ...newProperties,
            date_added: testList[itemID -1].date_added
          });
        });
    });
  });
  
  context('Given \'shopping_list\' doesn\'t have data', () => {
    it('getAllItems() should resolve empty array from \'shopping_list\' table', () => {
      return ShoppingListService.getAllItems(db)
        .then (list => {
          expect(list).to.eql([]);
        });
    });
  });

  it('createItem() should insert new item into \'shopping_list\' and resolve newly created item', () => {
    const newItem = {
      date_added: new Date('1918-12-22T16:28:32.615Z'),
      name: 'new item!',
      category: 'Lunch',
      price: '80.83', 
      checked: true
    };
    return ShoppingListService.createItem(db, newItem)
      .then ( res => {
        expect(res).to.eql({
          id: 1,
          date_added: newItem.date_added,
          name: newItem.name,
          category: newItem.category,
          price: newItem.price, 
          checked: newItem.checked
        });
      });
  });
});