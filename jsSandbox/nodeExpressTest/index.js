const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello from Express')
})

//app.listen(port, () => console.log(`app listening on port ${port}`))

// Launch app
app.listen(port, () => {
  console.log(`Launching app... http://localhost:${port}` + '\n');
  //console.log({app});
});