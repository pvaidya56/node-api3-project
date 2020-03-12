const express = require('express');

const Users = require("./userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

router.post('/', (req, res) => {
  // do your magic!
});

router.post('/:id/posts', validateUserId, (req, res) => {
  req.body.user_id = req.user.id;
  Posts.insert(req.body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({error: "Error Posting"})
    })
});

router.get('/', (req, res) => {
  Users.get()
    .then(response => {
      res.status(200).json(response)
    })
    .catch(error => {
      res.status(500).json({
        error: "The users information could not be retrieved"
      })
    })
});

router.get('/:id', validateUserId, (req, res) => {
  Users.getById(req.params.id)
  .then(response => {
    if (response) {
      res.status(200).json(response)
    }
    else {
      res.status(404).json({
        message: "The user with the specified ID does not exist"
      })
    }
  })
  .catch(error => {
    res.status(500).json({
      error: "The user information could not be retrieved"
    })
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.user.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({error: "Error fetching user posts"})
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then(res => {
      res.status(200).json({message: "User has been deleted"})
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({error: "Error deleting user"})
    })
});

router.put('/:id', validateUserId, (req, res) => {
  Users.update(req.params.id, req.body)
    .then(updatedUser => {
      res.status(201).json({message: "Username has been updated successfully"})
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({error: "Error updating user"})
    })
});

//custom middleware
//ensures that an id exists 
function validateUserId(req, res, next) {
  Users.getById(req.params.id)
  .then(user => {
    if (user.id){
      req.user = user; //attaching a value to our request
    } next();
  })
  .catch(error => {
    console.log(error)
    res.status(400).json({message: "Invalid User ID"})
  })
  }

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({message: "missing user data"})
  }
  else if (!req.body.name) {
    res.status(400).json({message: "missing required name field"})
  }
  else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({message: "Missing post data"})
  }
  else if (!req.body.text) {
    res.status(400).json({message: "Missing required text field"})
  }
  else {
    next();
  }
}

module.exports = router;
