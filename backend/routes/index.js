const express = require('express');
const router = express.Router();

router.get('/public-config', (req, res) => {
  res.json({
    IMAGE_SERVER_URL: process.env.IMAGE_SERVER_URL
  });
});

module.exports = router;