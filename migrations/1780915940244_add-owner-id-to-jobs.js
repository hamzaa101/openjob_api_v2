exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('jobs', {
    owner_id: {
      type: 'varchar(50)',
      references: 'users',
      onDelete: 'SET NULL',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('jobs', 'owner_id');
};