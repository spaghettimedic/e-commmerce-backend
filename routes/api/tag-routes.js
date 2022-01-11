const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// READ all Tags
router.get('/', (req, res) => {
  Tag.findAll({
    order: [['tag_name', 'DESC']],
    attributes: [
      'id',
      'tag_name'
    ],
    include: {
      model: Product,
      attributes: ['product_name', 'price', 'stock', 'category_id'],
      through: ProductTag,
      as: 'products'
    }
  })
  .then(dbTagData => res.status(200).json(dbTagData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// READ one Tag
router.get('/:id', (req, res) => {
  Tag.findOne({
    where: {
      id: req.params.id
    },
    order: [['tag_name', 'DESC']],
    attributes: [
      'id',
      'tag_name'
    ],
    include: {
      model: Product,
      attributes: ['product_name', 'price', 'stock', 'category_id'],
      through: ProductTag,
      as: 'products'
    }
  })
  .then(dbTagData => res.status(200).json(dbTagData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// CREATE new Tag
router.post('/', (req, res) => {
  Tag.create({
    tag_name: req.body.tag_name
  })
  .then(dbTagData => res.status(200).json(dbTagData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// UPDATE one Tag (only thing to update is tag_name)
router.put('/:id', (req, res) => {
  Tag.update(
    {
    tag_name: req.body.tag_name
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ message: 'No Tag found with this id '});
      return;
    }
    res.status(200).json(dbTagData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// DELETE one Tag
router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ message: 'No Tag found with this id' });
      return;
    }
    res.status(200).json(dbTagData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;
