const fs = require('fs')
const express = require('express');
const path = require('path');
const uuidv1 = require('uuidv1')

const app = express();
const PORT = process.env.PORT || 8000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/assets/css",express.static(path.join(__dirname, "public/assets/css")));
app.use("/assets/js",express.static(path.join(__dirname, "public/assets/js"))); 
app.use(express.static(path.join(__dirname, "./public")));


//HTML routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});


app.get("/api/notes", (req, res)=> {
    res.sendFile(path.join(__dirname, "db/db.json"));
});


//API routes
app.post("/api/notes", (req, res) => {

    let newNote = req.body;
    newNote.id = uuidv1();

    if (!newNote) {
        throw error
    }

    fs.readFile(path.join(__dirname, "db/db.json"), (err, data) => {
        if (err) {
            throw err
        };

        let file = JSON.parse(data);

        file.push(newNote);

        fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(file), err => {
            if (err) throw err;
        });

        res.json(newNote);
    });

    console.log(newNote);
});


app.delete("/api/notes/:id", (req, res) => {
    fs.readFile(path.join(__dirname, "db/db.json"), (err, data) => {
        if (err) {
            throw err
        };

        const notefile = JSON.parse(data);

        const newFile = notefile.filter(note => note.id != req.params.id);
        fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringify(newFile), err => {
            if (err) {
                throw err;
            }
        });
        
        res.sendFile(path.join(__dirname, "db/db.json"));
    });

    
});




app.listen(PORT, () => {
    console.log("Listening on " + PORT)
})


