'use strict';

const Hapi = require('@hapi/hapi');
const routes = require('./routes');

// Konfigurasi environment
const ENV = {
  PORT: 3000,
  HOST: '0.0.0.0',
  MAX_FILE_SIZE: 1000000, // 1 MB
  MODEL_URL: 'https://storage.googleapis.com/model-cancer-prediction/submissions-model/model.json', // Ganti dengan URL model Anda
};

// Inisialisasi server
const init = async () => {
  const server = Hapi.server({
    port: ENV.PORT,
    host: ENV.HOST,
    routes: {
      cors: {
        origin: ['*'], // Izinkan akses dari semua domain
      },
    },
  });

  // Tambahkan routes
  server.route(routes(ENV));

  // Start server
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

// Tangani error pada server
process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
