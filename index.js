const { DiffieHellmanGroup } = require("crypto");
const express = require("express");
const app = express();
const path = require("path");

// const mongoose = require('mongoose');
// mongoose.connect("mongodb://127.0.0.1:27017/demoComments")
// .then(() => {
//    	console.log("CONNECTED TO MONGODB")
// })
// .catch(err => {
//  	console.log("ERROR CONNECTING TO MONGODB:", err)
// })

app.use(express.static(path.join(__dirname, "/public"))); //serves static files for use

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views")); // where our ejs files will be

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/snake", (req, res) => {
    res.render("game");
});

app.get("/cats", (req, res) => {
    const cats = [
        "Walter White",
        "Sie",
        "Juana de Arcos",
        "Ramses II",
        "Otto von Bismarck",
    ];
    res.render("cats", { cats });
});

// app.get("/rand", (req, res) => {
//   const num = Math.floor(Math.random() * 10) + 1;
//   res.render("random", { num });
// });

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
});

// Index: GET /comments - list all comments
// New: GET /comments/new - obtain form to create new comment
// Create: POST /comments - create a new comment
// Show: GET /comments/:id - get one comment w/ ID
// Edit: GET /comments/:id/edit - obtain form to edit comment
// Update: PATCH /comments/:id - update one comment
// Destroy: DELETE /comments/:id - destroy one comment

// const cmts = {0: {
//     user:'Admin',
//     message: 'Making a RESTful App!!! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam, necessitatibus tenetur aut rem, officia in atque dolor consequatur soluta quia ut illum recusandae. Rerum odio eveniet beatae, ea commodi nemo? Sequi ut culpa dolorum iste possimus corrupti totam aliquam molestiae consequuntur in aliquid neque incidunt quo officiis eligendi expedita optio ipsum fuga sunt harum, amet odit modi. Laudantium, iusto placeat!',
//     time: '1:52:16 AM',
//     date: 'Thu Aug 03 2023'
// },
// 1: {
//     user:'Admin2',
//     message: 'TESTING COMMENTS!!!',
//     time: '2:07:42 AM',
//     date: 'Thu Aug 03 2023'
// },
// }

// let cmts_running_ID = 2

// const commentsSchema = new mongoose.Schema({
//     _id : {
//         type: String,
//         required: true,
//         default: uuid.generate()
//     },
//     user: {
//         type: String,
//         required: true,
//     },
//     message: {
//         type: String,
//         required: true
//     },
//     date: {
//         type: Date,
//         default: function() {
//             return new Date()
//         }
//     }
// })

// commentsSchema.virtual("time").get(function () {
// 	return this.date.toLocaleTimeString()
// })

// commentsSchema.virtual("day").get(function () {
//     return this.date.toLocaleDateString()
// })

// const Comment = mongoose.model('Comment', commentsSchema)

// const adminComment = new Comment({
//     user:'Admin',
//     message: 'Making a RESTful App and storing the data in MongoDB!!! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam, necessitatibus tenetur aut rem, officia in atque dolor consequatur soluta quia ut illum recusandae. Rerum odio eveniet beatae, ea commodi nemo? Sequi ut culpa dolorum iste possimus corrupti totam aliquam molestiae consequuntur in aliquid neque incidunt quo officiis eligendi expedita optio ipsum fuga sunt harum, amet odit modi. Laudantium, iusto placeat!',
// })

// adminComment.save()

// const adminComment2 = new Comment({
//     user:'Admin2',
//     message: "TEST MESSAGE"
// })

// adminComment2.save()

// console.log(adminComment.time)
// console.log(adminComment.day)

// Load to memory
// const cmts = {}
// Comment.find({}).then(data => {
//     for (let cmt of data) {
//         cmts[cmt._id] = {
//             _id: cmt._id,
//             user: cmt.user,
//             message: cmt.message,
//             date: cmt.day,
//             time: cmt.time
//         }
//     }
// })

/*
// Comments Index
app.get('/comments', (req, res) => {
    res.render('comments/comments', {cmts})
})

// New Comment Form
app.get('/comments/new', (req, res) => {
    res.render('comments/new')
})

app.use(express.urlencoded({ extended: true } ))

// Create Comment
app.post('/comments', async (req, res) => {
    console.log("SUBMITTED COMMENT!")
    console.log(req.body)
    
    const newCmt = new Comment({
        "user": req.body.user,
        "message": req.body.message
    })
    
    try {
        await newCmt.save()

        // Update Memory
        cmts[newCmt._id] = {
            _id: newCmt._id,
            user: newCmt.user,
            message: newCmt.message,
            date: newCmt.day,
            time: newCmt.time
        }
        res.redirect('/comments')
    } catch (err) {
        console.log(err.message)
        res.status(400).send("ERROR! " + err.message)
        console.log("Error sent")
    }
})

// Show Comment
app.get('/comments/:id', (req, res) => {
    const { id } = req.params
    if (cmts.hasOwnProperty(id)) res.send(cmts[id])
    else res.send("404 Not Found")
    
})

// Edit Comment, obtain form
app.get('/comments/:id/edit', (req, res) => {
    const { id } = req.params
    if (cmts.hasOwnProperty(id)) res.render("comments/edit", { id, user: cmts[id].user, message: cmts[id].message})
    else res.send("404 Not Found")
})

// Update Comment
app.patch('/comments/:id', (req, res) => {
    let { id } = req.params

    if (!cmts.hasOwnProperty(id)) {
        res.send("404 Not Found")
        return
    }

    console.log("RECEIVED PATCH FOR", id)
    Comment.updateOne({_id: id}, {message: req.body.message})
    .then((data) => {
        console.log(data)
        cmts[id].message = req.body.message
        res.redirect('/comments')
    })
    .catch(e => {
        console.log("ERROR UPDATING: " + e)
        res.send("ERROR UPDATING: " + e)
    })
    
})

// Delete Comment
app.delete('/comments/:id', (req, res) => {
    let { id } = req.params
    console.log("RECEIVED DELETE FOR", id)
    Comment.deleteOne({_id: id})
    .then(data => {
        delete cmts[id]
        res.send("DELETION SUCCESSFUL")
    })
    .catch(err => {
        console.log("ERROR DELETING" + err)
        res.status(400).send("ERROR DELETING: " + err)
    })
    
})
*/
