const Thought = require('../models/thought');

exports.home = (req, res) => res.send('brain bog backend');

exports.thoughts = (req, res) => {
    Thought.find((err, thought) => {
        if (err) return res.status(500).send(err)
        return res.status(200).send(thought);
    })
};

exports.thought_by_id = (req, res) => {
    Thought.findById(req.params.id, (err, product) => {
        if (err) return next(err);
        res.send(product);
    })
};