const BaseRepository = require('./base.repository');
const Vehicle = require('../models/Vehicle.model');

class VehicleRepository extends BaseRepository {
  constructor() {
    super(Vehicle);
  }

  // We can add vehicle-specific custom database operations here if needed in the future
}

module.exports = new VehicleRepository();
