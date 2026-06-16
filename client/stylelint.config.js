/** @type {import('stylelint').Config} */
module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order'],
  rules: {
    'no-empty-source': null,
    'hue-degree-notation': 'number',
  },
};
