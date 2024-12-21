const tf = require('@tensorflow/tfjs-node');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Fungsi untuk memuat model dari URL
let model;
const loadModel = async (modelUrl) => {
  if (!model) {
    console.log('Loading model from:', modelUrl);
    model = await tf.loadLayersModel(modelUrl);
    console.log('Model loaded successfully');
  }
};

// Fungsi untuk preprocessing gambar
const preprocessImage = (fileBuffer) => {
  const decodedImage = tf.node.decodeImage(fileBuffer, 3);
  const resizedImage = tf.image.resizeBilinear(decodedImage, [224, 224]);
  const normalizedImage = resizedImage.div(255.0);
  return normalizedImage.expandDims(0);
};

// Fungsi utama untuk prediksi
const handlePrediction = async (file, modelUrl) => {
  // Muat model jika belum tersedia
  await loadModel(modelUrl);

  // Preprocessing file gambar
  const imageBuffer = file._data;
  const imageTensor = preprocessImage(imageBuffer);

  // Prediksi dengan model
  const predictions = model.predict(imageTensor);
  const predictionArray = predictions.dataSync();

  // Dummy logic: Threshold untuk menentukan kanker atau tidak
  const isCancer = predictionArray[0] > 0.5;
  const result = isCancer ? 'Cancer' : 'Non-cancer';
  const suggestion = isCancer
    ? 'Segera periksa ke dokter!'
    : 'Penyakit kanker tidak terdeteksi.';

  // Generate response
  return {
    id: uuidv4(),
    result,
    suggestion,
    createdAt: new Date().toISOString(),
  };
};

module.exports = { handlePrediction };