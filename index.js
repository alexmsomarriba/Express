
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 4000

const { users } = require('./state')
let counter = users.length

/* BEGIN - create routes here */
app.use(bodyParser.json()
)
// GET all
app.get('/users', (req, res) => {
  console.log("this is a get all request")
  res.json(users)
})
// GET user id
app.get('/users/:userId', (req, res) =>{
  console.log("this requests a user by ID")
  console.log(req.params.userId)
  // the .some method returns false if no user._id matches the requests's userID
  if(!users.some(user => user._id == req.params.userId)){
    res.status(400).json({ msg: `No user with an ID of ${req.params.userId}`})
    // the .filter method returns the element[s] of the users array that pass the test
  } else res.json(users.filter(user => user._id == req.params.userId))
})
// POST
app.post('/users', (req, res) =>{
  console.log('this adds a user')
  console.log(req.body)
  // New objects must have a name, occupation, and avatar.
  // If the body doesn't include these things, the response in a 400.
  if (!req.body.name || !req.body.occupation || !req.body.avatar) {
    return res.status(400).json({ msg: "Please include a name, occupation, and avatar."})
  }
  // counter's sole purpose is assigning a new ID to each POST
  counter++
  // We create a new object,  declare keys, and use values from req.body
  const newUser = {
    _id: counter,
    name: req.body.name,
    occupation: req.body.occupation,
    avatar: req.body.avatar
  }
  console.log(newUser)
  // We push the newly created object to the users array and return
  // the newly created object as a response.
  users.push(newUser)
  res.json(users.filter(user => user._id == counter))
})
// PUT
app.put('/users/:userId', (req, res) =>{
  console.log("this updates a user's data")
  // First, you find the user whose data will be updated
  const user = users.find((user) => user._id == req.params.userId)
  // Then, you take the updates from the req body
  const alterations = req.body
  // You can use the spread operator to create a new variable with the contents of user.
  // When you spread alterations, the new key values override the previous ones.
  const updatedUser = {
    ...user,
    ...alterations
  }
  console.log(updatedUser)
  // Next, you make a reference to the index for the user you updated.
  let index = users.findIndex((user) => user._id == req.params.userId)
  // You use the splice method, starting at that index, to remove 1 user
  // and replace it with the updated user data.
  users.splice(index, 1, updatedUser)
  // Then you return the updated user as a response.
  res.json(users[index])
})
// DELETE
app.delete('/users/:userId', (req, res) =>{
  console.log('this deletes a user')
  // You can use the same line from earlier to get the index for the 
  // requested user
  let index = users.findIndex((user) => user._id == req.params.userId)
  // Only this time, you use .splice without any replacement variable.
  // users.splice(index, 1)
  // But the instructions don't want an actual deletion, but rather the addition
  // of a new key/value pair:  isActive: false.  So instead...
  const user = users.find((user) => user._id == req.params.userId)
  user.isActive = false
  res.send('deleted!')
})
/* END - create routes here */

app.listen(port, () => 
  console.log(`Example app listening on port ${port}!`))