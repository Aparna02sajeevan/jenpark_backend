/**
 * Generic repository abstraction.
 * Extend per-entity (e.g., user.repository.js) to keep DB access isolated from services.
 */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  create(doc) {
    return this.model.create(doc);
  }

  findById(id, projection = null) {
    return this.model.findById(id, projection);
  }

  findOne(filter, projection = null) {
    return this.model.findOne(filter, projection);
  }

  find(filter = {}, { limit = 50, skip = 0, sort = { createdAt: -1 } } = {}) {
    return this.model.find(filter).sort(sort).skip(skip).limit(limit);
  }

  updateById(id, update, options = { new: true }) {
    return this.model.findByIdAndUpdate(id, update, options);
  }

  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  count(filter = {}) {
    return this.model.countDocuments(filter);
  }
}

module.exports = BaseRepository;
