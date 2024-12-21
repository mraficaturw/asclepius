const { handlePrediction } = require('./utils');

const routes = (ENV) => [
  {
    method: 'POST',
    path: '/predict',
    options: {
      payload: {
        output: 'stream',
        parse: true,
        maxBytes: ENV.MAX_FILE_SIZE, // Batas ukuran file
        multipart: true,
        allow: 'multipart/form-data',
      },
    },
    handler: async (request, h) => {
      try {
        const { payload } = request;
        const file = payload.image;

        // Validasi file
        if (!file || !file._data) {
          return h.response({
            status: 'fail',
            message: 'File gambar tidak ditemukan',
          }).code(400);
        }

        const response = await handlePrediction(file, ENV.MODEL_URL);
        return h.response({
          status: 'success',
          message: 'Model is predicted successfully',
          data: response,
        }).code(200);
      } catch (error) {
        console.error(error);
        if (error.message.includes('Payload content length')) {
          return h.response({
            status: 'fail',
            message: `Payload content length greater than maximum allowed: ${ENV.MAX_FILE_SIZE}`,
          }).code(413);
        }

        return h.response({
          status: 'fail',
          message: 'Terjadi kesalahan dalam melakukan prediksi',
        }).code(400);
      }
    },
  },
];

module.exports = routes;
