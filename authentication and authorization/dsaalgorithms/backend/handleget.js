const express = require('express');
const app = express();
const cors = require('cors');
const {mergeSort,merge} = require('../mergeSort');
const {Node,AVLTree} = require('../AVL');
const { SearchByName } = require('../searchByName');
const { SearchByDate } = require('../searchByDate'); 
const Bookings = require('../bookings.js');
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token','Access-Control-Allow-Origin']
//   }));
  

const filePath1 = path.join(__dirname, 'futsalfile.json');
const futsalData = JSON.parse(fs.readFileSync(filePath1, 'utf8'));

const futsalTreeByName = new SearchByName();
for (let item of futsalData) {
    futsalTreeByName.insert(item);
};
const futsalTreeByDate = new SearchByDate();
for (let item of futsalData) {
    futsalTreeByDate.insert(item);
};

app.get('/searchByName/:name', (req, res) => {
    const name = req.params.name.toLowerCase().replace(/\s/g, "");
    let result = futsalTreeByName.searchByName(name);

    if (req.query.sort) {
        const sortField = req.query.sort.toLowerCase();
        if (sortField === 'name') {
            result = mergeSort(result, 'name');
        } else if (sortField === 'price') {
            result = mergeSort(result, 'price');
        }
    }


    res.json(result);
});

app.get('/searchByDate/:date', (req, res) => {
    
    const date = req.params.date.replace(/^"|"$/g, '');
    const result = futsalTreeByDate.searchByDate(date);
    res.json(result);
});

app.use("/Bookings",Bookings);

app.get('/futsals', (req, res) => {
    res.json(futsalData);
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});