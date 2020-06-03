import express from 'express';

const routes = express.Router();

routes.get('/users', (request, response) => {
  return response.send('Hello World');
});

export default routes;
