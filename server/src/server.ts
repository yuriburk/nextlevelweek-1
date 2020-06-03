import express from 'express';

const app = express();

app.get('/users', (request, response) => {
  return response.send('Hello World');
});

app.post('/users', (request, response) => {
  return response.json('Usuário');
});

app.listen(5000, () => console.log('🚀 Server started at port 5000'));
