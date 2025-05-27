const express = require('express');
const app = express();
require('dotenv').config();
const emergencyRoute = require('./routes/emergency');

app.use(express.json()); // for parsing application/json

// Mount emergency route
app.use('/api/user/emergency', emergencyRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
