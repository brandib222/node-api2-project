// implement your posts router here

const express = require('express')

const router = express.Router()

module.exports = router

// data access functions
const Post = require('./posts-model')

// THIS IS WHERE WE MAKE ENDPOINTS
// use option + command + up arrow to write multiple lines at once


router.get('/', (req, res) => {
    Post.find()
    .then(found => {
        //"throw new Error('ouch')" to check that error code is working like a console.log()
        res.json(found)
    }).catch(err => {
        res.status(500).json({
            message: 'The posts information could not be retrieved',
            err: err.message,
            stack: err.stack
        })
    })
})
router.get('/:id', async (req, res) => {
    try {
        //throw new Error('whyyyy')
        const post = await Post.findById(req.params.id)
        if(!post) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist'
            })
        } else {
            // DONT FORGET ABOUT THE ELSE -- either have to do else or a return inside the if statement
            res.json(post)
        }
        
    } catch (err) {
        res.status(500).json({
            message: 'The post with this information does not exist',
            err: err.message,
            stack: err.stack,
        })
    }

})
router.post('/', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({
            message:'Please provide title and contents for the post'
        })
    } else {
        // client supplied correct info
        Post.insert({ title, contents })
            .then(({id}) => {
             // stuff comes back as just an object with an id, so destructure id in order to get everything back
            return Post.findById(id)
            .then(post => {
                res.status(201).json(post)
            })
        }).catch(err => {
            res.status(500).json({
                message: 'There was an error while saving the post to the database',
                err: err.message,
                stack: err.stack,
            })
        })
    }

})
router.delete('/:id', async (req, res) => {
    // needs to handle if the id exists and if it doesn't exist
    try {
        // throw new Error('sad as heck!')
        const post = await Post.findById(req.params.id)
        if(!post) {
            res.status(404).json({
                message:'The post with the specified ID does not exist',
                
            })
        } else {
            await Post.remove(req.params.id)
            res.json(post)
            // console.log(stuff)
            // returns huge object if you forget await

        }
    } catch (err) {
        res.status(500).json({
            message:'The post could not be removed',
            err: err.message,
            stack: err.stack,
        })
    }
})
router.put('/:id', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({
            message:'Please provide title and contents for the post'
        })
    } else {
        Post.findById(req.params.id)
        .then(stuff => {
            //console.log(stuff)
            if(!stuff) {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist'
                })
            } else {
                return Post.update(req.params.id, req.body)
            }
        }) .then(data => {
            //console.log(data)
            if(data) {
                return Post.findById(req.params.id)
            }
        }) .then(post => {
            if(post) {
                res.json(post)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'The posts information could not be retrieved',
                err: err.message,
                stack: err.stack
            })
        })
    }

})
router.get('/:id/messages', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist'
            })
        } else {
            const messages = await Post.findPostComments(req.params.id)
            // console.log(stuff)
            res.json(messages)
        }
    } catch(err) {
        res.status(500).json({
            message: 'The messages information could not be retrieved',
            err: err.message,
            stack: err.stack
        })
    }
})
