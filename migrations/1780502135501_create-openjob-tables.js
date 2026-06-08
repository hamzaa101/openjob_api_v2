exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    name: {
      type: 'text',
      notNull: true,
    },
    email: {
      type: 'text',
      notNull: true,
    },
    password: {
      type: 'text',
      notNull: true,
    },
    role: {
      type: 'varchar(30)',
      notNull: true,
      default: 'user',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint('users', 'users_email_unique', {
    unique: ['email'],
  });

  pgm.createTable('authentications', {
    token: {
      type: 'text',
      primaryKey: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createTable('companies', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    name: {
      type: 'text',
      notNull: true,
    },
    location: {
      type: 'text',
      notNull: true,
    },
    description: {
      type: 'text',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createTable('categories', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    name: {
      type: 'text',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createTable('jobs', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    company_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'companies',
      onDelete: 'CASCADE',
    },
    category_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'categories',
      onDelete: 'CASCADE',
    },
    title: {
      type: 'text',
      notNull: true,
    },
    description: {
      type: 'text',
      notNull: true,
    },
    job_type: {
      type: 'varchar(50)',
      notNull: true,
    },
    experience_level: {
      type: 'varchar(50)',
      notNull: true,
    },
    location_type: {
      type: 'varchar(50)',
      notNull: true,
    },
    location_city: {
      type: 'text',
    },
    salary_min: {
      type: 'integer',
    },
    salary_max: {
      type: 'integer',
    },
    is_salary_visible: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    status: {
      type: 'varchar(30)',
      notNull: true,
      default: 'open',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createTable('applications', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    job_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'jobs',
      onDelete: 'CASCADE',
    },
    status: {
      type: 'varchar(30)',
      notNull: true,
      default: 'pending',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createTable('bookmarks', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    job_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'jobs',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint('bookmarks', 'bookmarks_user_job_unique', {
    unique: ['user_id', 'job_id'],
  });

  pgm.createTable('documents', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    file_name: {
      type: 'text',
      notNull: true,
    },
    original_name: {
      type: 'text',
      notNull: true,
    },
    mime_type: {
      type: 'text',
      notNull: true,
    },
    file_path: {
      type: 'text',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('documents');
  pgm.dropTable('bookmarks');
  pgm.dropTable('applications');
  pgm.dropTable('jobs');
  pgm.dropTable('categories');
  pgm.dropTable('companies');
  pgm.dropTable('authentications');
  pgm.dropTable('users');
};