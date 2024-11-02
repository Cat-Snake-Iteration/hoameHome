const db = require('../models/hoameModels.js');

const pollController = {};


//Creates new poll and adds it to database 
pollController.createPoll = async (req, res, next) => {
    let { question_title } = req.body;
    try {
        const pollString = 'INSERT into questions (question_title) VALUES ($1) RETURNING *'
        const newQuestion = await db.query(pollString, [
            question_title
        ]);
        if (!newQuestion.rows.length) {
            return next({
              log: 'createPoll',
              message: { err: 'Failed to create poll.' },
            });
        }
        res.locals.question = newQuestion.rows[0];
        return next();
    } catch (err) {
        console.log(err);
        next({
            log: 'Error creating poll',
            message: {
                err: 'pollController.createPoll error. Failed to create poll.'
            },
        });
    }
}

pollController.answerPoll = async (req, res, next) => {
    
}

pollController.getResults = async () => {
    
}

//Gets all polls
pollController.getPolls = async (req, res, next) => {
    try {
        const getPollsString = 'SELECT * FROM questions';
        const pollsResult = await db.query(getPollsString);
        const polls = pollsResult.rows;
        console.log("POLLS", polls)
        res.locals.polls = polls;
        next();
    } catch (err) {
        console.log(err);
        next({
          log: 'getPolls',
          message: {
            err: 'pollController.getPolls ERROR: Check server logs for details',
          },
        });
      }
}

module.exports = pollController;