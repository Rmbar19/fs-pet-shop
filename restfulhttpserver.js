//create database with values inside
//connect database to express server with GET functionality working
const { response } = require('express');
const express = require('express');
const app = express();
const PORT = 3009
 const {Client} = require('pg');

 const connectionString = 'postgresql://postgres:hello123@127.0.0.1:5432/petsdata'

const client = new Client({
    connectionString: connectionString,
})

app.use(express.json());
 
client.connect();

app.get('/', (req, res) => {
    res.send("Hello World")
});

app.get('/pets/:id', function (req, res) {
    client.query(`SELECT * FROM pets WHERE id = ${req.params.id}`)
    .then(result => {
        if(result.rows.length == 0) {
            res.status(404);
            res.send('pet doesn\'t exist');
            return
        }
        res.send(result.rows);
        res.end();
    })
});
app.get('/pets', function (req,res) {
   client.query('SELECT * FROM Pets')
   .then(result => {
    if(result.rows.length == 0) {
        res.status(404);
        res.send('pet doesn\'t exist');
        return
    }
    res.send(result.rows);
    res.end();
})
});

app.post('/pets', function (req,res) {
  
 var pet = req.body
 
  if (typeof req.body.age === 'number') {
   console.log("age worked")
   if (typeof req.body.kind === 'string') {
    console.log("kind worked")
    if (typeof req.body.name === 'string') {
        console.log("name worked")
        {
            client.query(`INSERT INTO pets (name,age, kind) VALUES ('${pet.name}', ${pet.age}, '${pet.kind}');`)
             .then (result => {
                   res.send(pet); 
               }) 
            }
    }
   } 
  
    } else {
            res.send("ERROR: Include name, age, and kind")
        }
         
 })

 app.patch('/pets/:id', function (req, res) {
    var pet = req.body
     if ( typeof pet.age === 'number' && pet.kind && pet.name) 
    {
    client.query(`UPDATE pets SET name ='${pet.name}', age =${pet.age}, kind='${pet.kind}' WHERE id = ${req.params.id}`)
    
    .then (result => {
        var test1 = JSON.stringify(pet) 
        res.send(test1);
    })
    }
    else {
        res.send("ERROR: Include name, age, and kind")
    }

 })
app.delete('/pets/:id', function (req, res) {
    var deletepet = req.body.name
    if ( res.statusCode === 200) {
    client.query(`DELETE FROM pets WHERE id = ${req.params.id}`)
    res.send(`Deleted pet ID ${req.params.id}, ${deletepet}`)
    } else {
        res.send(`Error: Status code ${res.statusCode}`)
    }

})



 app.listen(PORT, function() {
     console.log('server is running');
 });

