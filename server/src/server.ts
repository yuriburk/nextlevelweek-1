import express from 'express';

const app = express();

app.get('/users', (request, response) => {
  console.log('Listagem de usuários');

  response.send('Hello World');
});

app.listen(5000, () => console.log('🚀 Server started at port 5000'));
