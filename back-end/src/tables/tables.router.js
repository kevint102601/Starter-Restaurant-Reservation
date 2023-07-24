const express = require('express');
const tablesController = require('./tables.controller');
const router = express.Router();
const methodNotAllowed = require('../errors/methodNotAllowed')

router
  .route('/:table_id/seat')
  .put(tablesController.seatReservation)
  .delete(tablesController.finishOccupiedTable)
  .all(methodNotAllowed)
router
.route('/:table_id')
.get(tablesController.getTable)
.all(methodNotAllowed)
router
  .route('/')
  .get(tablesController.getAllTables)
  .post(tablesController.createTable)
  .all(methodNotAllowed)


module.exports = router;