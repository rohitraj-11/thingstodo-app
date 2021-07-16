const express = require('express')
const Task = require('../models/task')
const auth =require('../middleware/auth')
const router = new express.Router()

router.get('/tasks/addTasks',(req,res) => {
    res.render('addTasks')
}) 

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        //res.status(201).send(task)
        res.render('addTasks')
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:asc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        //const tasks = await Task.find({owner: req.user._id})
        await req.user.populate({
            path: 'tasks',
            match: match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sort
            }
        }).execPopulate()
        const tasks = req.user.tasks
        console.log(tasks)
        res.render('tasks',{tasks})
        //res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task =await Task.findOne({_id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        //res.send(task)
        var flag = task.completed
        res.render('editTask', {task, flag})
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.redirect('/tasks')
    } catch (e) {
        res.status(400).send(e)
    }
    // const _id = req.params.id
    // try {
    //     const blog = await Blog.findOne({ _id }).populate('owner').exec()
    //     // console.log(blog)
    //     if(!blog)   {
    //         res.status(404).send()
    //     }
    //     let flag = blog.owner._id.equals(req.user._id)
    //     if(!flag)   {
    //         res.status(403).send()
    //     }
    //     blog.title = req.body.title
    //     blog.body = req.body.body
    //     await blog.save();
    //     res.redirect('/myblogs')
    // }   catch (e) {
    //     res.status(500).send()
    // }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if (!task) {
            res.status(404).send()
        }

        //res.send(task)
        console.log('deleted')
        res.redirect('/tasks')
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router