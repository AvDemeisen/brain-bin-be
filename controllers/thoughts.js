const Thought = require('../models/thought');

exports.home = (req, res) => res.send('brain-bog-be');

exports.thoughts = (req, res) => {
    Thought.find((err, thought) => {
        if (err) return res.status(500).send(err)
        return res.status(200).send(thought);
    })
};

