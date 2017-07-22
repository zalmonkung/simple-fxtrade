import _ from 'lodash';

export const validate = (req, required) => {
  const invalid = _.difference(required, _.keys(req));

  if (!_.isEmpty(invalid)) throw new Error(`Required parameters missing: ${invalid.join(', ')}`);
};
