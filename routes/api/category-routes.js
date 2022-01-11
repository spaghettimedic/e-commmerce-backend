const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// READ all Categories
router.get('/', (req, res) => {
  Category.findAll({
    order: [['category_name', 'DESC']],
    attributes: [
      'id',
      'category_name',
      [sequelize.literal('(SELECT COUNT(*) FROM product WHERE category.id = product.category_id)'), 'quantity_of_products']
    ],
    include: {
      model: Product,
      attributes: ['product_name', 'price', 'stock', 'category_id']
    }
  })
  .then(dbCatData => res.status(200).json(dbCatData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// READ one Category
router.get('/:id', (req, res) => {
  Category.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'category_name',
      [sequelize.literal('(SELECT COUNT(*) FROM product WHERE category.id = product.category_id)'), 'quantity_of_products']
    ],
    include: {
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
    }
  })
  .then(dbCatData => {
    if (!dbCatData) {
      res.status(404).json({ message: 'No Category found with this id' });
      return;
    }
    res.json(dbCatData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// CREATE new Category
router.post('/', (req, res) => {
  Category.create({
    category_name: req.body.category_name
  })
  .then(dbCatData => res.status(200).json(dbCatData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// UPDATE one Category (only thing to update is category_name)
router.put('/:id', (req, res) => {
  Category.update(
    {
    category_name: req.body.category_name
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
  .then(dbCatData => {
    if (!dbCatData) {
      res.status(404).json({ message: 'No Category found with this id '});
      return;
    }
    res.status(200).json(dbCatData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// DELETE a single Category
router.delete('/:id', (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbCatData => {
    if (!dbCatData) {
      res.status(404).json({ message: 'No Category found with this id' });
      return;
    }
    res.status(200).json(dbCatData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;
