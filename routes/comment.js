const Comment = require('../models/comment');

async function getComments(req, res) {
  try {
    const comments = await Comment.find({});
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function postComment(req, res) {
  try {
      if (!req.body.comment) {
          return res.status(400).json({ errors: { comment: 'Comment field is required' } });
      }

      const newComment = new Comment(req.body);
      const savedComment = await newComment.save();
      return res.status(201).json({ message: 'Comment successfully added!', comment: savedComment });
  } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
  }
}


async function getComment(req, res) {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }
    res.json({ comment });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function deleteComment(req, res) {
  try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
      }

      const result = await Comment.deleteOne({ _id: req.params.id });
      return res.json({ message: 'Comment successfully deleted!', result });
  } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
  }
}


async function updateComment(req, res) {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedComment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }
    res.json({ message: 'Comment updated!', updatedComment });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getComments,
  postComment,
  getComment,
  deleteComment,
  updateComment,
};
