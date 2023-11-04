let mongoose = require("mongoose");
let Schema = mongoose.Schema;

//book schema definition
let CommentSchema = new Schema(
  {

    author: {
      type: String,
      required: false,
    },
    comment: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

// Sets the createdAt parameter equal to the current time
CommentSchema.pre("save", function(next) {
  now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});


//Exports the BookSchema for use elsewhere.
module.exports = mongoose.model("comment", CommentSchema);
