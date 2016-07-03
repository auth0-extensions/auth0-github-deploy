import * as rules from './rules'
import * as connections from './connections'

export default {
  /* COnnection and database operations */
  validateDatabases : connections.validateDatabases,
  updateDatabases : connections.updateDatabases,

  /* rules operations */
  validateRules : rules.validateRules,
  deleteRules : rules.deleteRules,
  updateRules : rules.updateRules,
}
