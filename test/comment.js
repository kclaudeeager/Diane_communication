process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Comment = require('../models/comment');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const supertest = require('supertest');
const app = require('../server');
chai.use(chaiHttp);

describe('Comments API Tests', () => {
    beforeEach((done) => {
        // Clear the database before each test
        Comment.deleteMany({}, (err) => {
            done();
        });
    });

    describe('POST /comment', () => {
      it('it should POST a comment with valid data', (done) => {
          const commentData = {
              comment: 'This is a test comment.'
          };
  
          chai.request(server)
              .post('/comment')
              .send(commentData)
              .end((err, res) => {
                  res.should.have.status(201);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message').eql('Comment successfully added!');
                  res.body.comment.should.have.property('comment').eql('This is a test comment.');
                  should.not.exist(res.body.comment.author); // Author is optional
                  done();
              });
      });
  
      it('it should not POST a comment without the comment field', (done) => {
        const invalidCommentData = {
            author: 'Claude' // This is missing the comment field
        };
    
        chai.request(server)
            .post('/comment')
            .send(invalidCommentData) // Include the comment field here
            .end((err, res) => {
                res.should.have.status(400); // Expect 400 for bad request
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('comment');
                done();
            });
    });
    
  });
  

    describe('GET /comment', () => {
        it('it should GET all comments', (done) => {
            chai.request(server)
                .get('/comment')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('GET /comment/:id', () => {
        it('it should GET a comment by the given id', (done) => {
            const comment = new Comment({
                author: 'Claude',
                comment: 'This is a test comment.'
            });

            comment.save((err, savedComment) => {
                chai.request(server)
                    .get('/comment/' + savedComment._id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.comment.should.have.property('author').eql('Claude');
                        res.body.comment.should.have.property('comment').eql('This is a test comment.');
                        res.body.comment.should.have.property('_id').eql(savedComment._id.toString());
                        done();
                    });
            });
        });

        it('it should return 404 for non-existing comment id', (done) => {
            const invalidCommentId = '1234567890abcdef12345678'; // Invalid ObjectId format

            chai.request(server)
                .get('/comment/' + invalidCommentId)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Comment not found');
                    done();
                });
        });
    });

    describe('PUT /comment/:id', () => {
        it('it should UPDATE a comment given the id', (done) => {
            const comment = new Comment({
                author: 'Claude',
                comment: 'This is a test comment.'
            });

            comment.save((err, savedComment) => {
                chai.request(server)
                    .put('/comment/' + savedComment._id)
                    .send({ comment: 'Updated comment' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Comment updated!');
                        Comment.findById(savedComment._id, (err, updatedComment) => {
                            updatedComment.comment.should.eql('Updated comment');
                            done();
                        });
                    });
            });
        });

        it('it should return 404 for non-existing comment id', (done) => {
            const invalidCommentId = '1234567890abcdef12345678'; // Invalid ObjectId format

            chai.request(server)
                .put('/comment/' + invalidCommentId)
                .send({ comment: 'Updated comment' })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Comment not found');
                    done();
                });
        });
    });

    describe('DELETE /comment/:id', () => {
        it('it should DELETE a comment given the id', (done) => {
            const comment = new Comment({
                author: 'Claude',
                comment: 'This is a test comment.'
            });

            comment.save((err, savedComment) => {
                chai.request(server)
                    .delete('/comment/' + savedComment._id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Comment successfully deleted!');
                        Comment.findById(savedComment._id, (err, deletedComment) => {
                            should.not.exist(deletedComment);
                            done();
                        });
                    });
            });
        });

        it('it should return 404 for non-existing comment id', (done) => {
            const invalidCommentId = '1234567890abcdef12345678'; // Invalid ObjectId format

            chai.request(server)
                .delete('/comment/' + invalidCommentId)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Comment not found');
                    done();
                });
        });
    });
});
describe('MongoDB Connection Tests', () => {
  it('should connect to MongoDB Atlas', (done) => {
      supertest(app)
          .get('/comment') // You can use any endpoint that interacts with the database
          .expect(200) // Expect a successful response code indicating a successful connection
          .end((err, res) => {
              if (err) return done(err);
              // Add additional checks if necessary, e.g., check response body or headers
              done();
          });
  });
});
