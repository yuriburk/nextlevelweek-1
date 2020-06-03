import express from 'express';
import path from 'path';

import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(5000, () => console.log('🚀 Server started at port 5000'));
