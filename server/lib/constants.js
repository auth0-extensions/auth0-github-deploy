export const RULES_DIRECTORY = 'rules';

export const DATABASE_CONNECTIONS_DIRECTORY = 'database-connections';

export const PAGES_DIRECTORY = 'pages';

export const DATABASE_SCRIPTS = [
  'get_user',
  'create',
  'verify',
  'login',
  'change_password',
  'delete'
];

export const PAGE_NAMES = [
  'password_reset',
  'login'
];

export const RULES_STAGES = [
  'login_success',
  'login_failure',
  'pre_authorize',
  'user_registration',
  'user_blocked'
];

export const DEFAULT_RULE_STAGE = RULES_STAGES[0];

export const CONCURRENT_CALLS = 5;
