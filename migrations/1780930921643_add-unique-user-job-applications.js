exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint('applications', 'applications_user_job_unique', {
    unique: ['user_id', 'job_id'],
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('applications', 'applications_user_job_unique');
};