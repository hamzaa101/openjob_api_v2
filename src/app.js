const express = require('express');

const usersRoutes = require('./routes/usersRoutes');
const authenticationsRoutes = require('./routes/authenticationsRoutes');
const companiesRoutes = require('./routes/companiesRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const jobsRoutes = require('./routes/jobsRoutes');
const applicationsRoutes = require('./routes/applicationsRoutes');
const bookmarksRoutes = require('./routes/bookmarksRoutes');
const profileRoutes = require('./routes/profileRoutes');
const documentsRoutes = require('./routes/documentsRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'OpenJob API V2 is running',
  });
});

app.use('/users', usersRoutes);
app.use('/authentications', authenticationsRoutes);
app.use('/companies', companiesRoutes);
app.use('/categories', categoriesRoutes);
app.use('/jobs', jobsRoutes);
app.use('/applications', applicationsRoutes);
app.use('/bookmarks', bookmarksRoutes);
app.use('/profile', profileRoutes);
app.use('/documents', documentsRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: 'failed',
    message: 'Route tidak ditemukan',
  });
});

app.use(errorHandler);

module.exports = app;