const db = require('../models/hoameModels');

const pollForm ={};

pollForm.addPoll = async(req, res, next) => {
    const {title_question} = req.body;
    if(!title_question){
        return next({
            log: 'Error in announcementController.createAnnouncements: ERROR: MISSING TITLE/MESSAGE',
            status: 400,
            message: {
              err: 'Title and message are required to create an announcement',
            },
          });
    }
    try{
        const query =  'INSERT INTO questions (title_question, created_at) VALUES ($1, NOW()) RETURNING *'
        const values = [title_question];
        const result = await db.query(query, values);
        res.locals.questions = result.rows[0];
        return next();
    }catch(error){
        return next({
            log: 'Error in pollForm.addPoll: ERROR:', error,
            status: 400,
            message: {
              err: 'Title is required to create Poll',
            },
          });
    }
}

module.exports = pollForm