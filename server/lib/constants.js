export const RULES_DIRECTORY = 'rules';

export const DATABASE_CONNECTIONS_DIRECTORY = 'database-connections';

export const DATABASE_SCRIPTS = [
  'get_user',
  'create',
  'verify',
  'login',
  'change_password',
  'delete'
];

export const RULES_STAGES = [
  'login_success',
  'login_failure',
  'pre_authorize',
  'user_registration',
  'user_blocked'
];

export const CONCURRENT_CALLS = 5;
