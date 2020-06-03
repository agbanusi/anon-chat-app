/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function(done) {
      chai.request(server)
      .post('/api/threads/')
      .send({
        board:'food',
        text:'Testing',
        delete_password:'position'
      })
      .end(function(err, res){
        assert.equal(res.status,200)
        done();
      })
    });
    
    suite('GET', function(done) {
      chai.request(server)
      .get('/b/food')
      .end(function(err,res){
        assert.equal(res.status,200)
        assert.isArray(res.body)
        assert.property(res.body[0],'_id')
        assert.property(res.body[0],'text')
        assert.property(res.body[0],'password')
        assert.property(res.body[0],'created_on')
        assert.property(res.body[0],'bumped_on')
        assert.property(res.body[0],'reported')
        assert.property(res.body[0],'replies')
        assert.isArray(res.body[0].replies)
        done();
      })
    });
    
    suite('DELETE', function(done) {
      chai.request(server)
      .put('/api/threads/food')
      .send({
        board:'food',
        _id:'cS65yDD5Z',
        delete_password:'position'
      })
      .end(function(err,res){
        assert.equal(res.status,200)
        assert.equal(res.text,'success')
        done();
      })
    });
    
    suite('PUT', function(done) {
      chai.request(server)
      .put('/api/threads/food')
      .send({
        board:'food',
        _id:'MvsvPkwkc'
      })
      .end(function(err,res){
        assert.equal(res.status,200)
        assert.equal(res.text,'success')
        done();
      })
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function(done) {
      chai.request(server)
      .post('/api/replies/')
      .send({
        board:'food',
        thread_id:'MvsvPkwkc',
        text:'Testing again',
        delete_password:'position'
      })
      .end(function(err, res){
        assert.equal(res.status,200)
        done();
      })
    });
    
    suite('GET', function(done) {
      chai.request(server)
      .get('/b/food/VSks3oM_3/')
      .end(function(err,res){
        assert.equal(res.status,200)
        assert.property(res.body,'_id')
        assert.property(res.body,'text')
        assert.property(res.body,'created_on')
        assert.property(res.body,'bumped_on')
        assert.property(res.body,'replies')
        assert.isArray(res.body.replies)
        done();
      })
    });
    
    suite('PUT', function(done) {
      chai.request(server)
      .post('/api/replies/')
      .send({
        board:'food',
        thread_id:'VSks3oM_3',
        reply_id:'h9hZnl_gd'
      })
      .end(function(err, res){
        assert.equal(res.status,200)
        assert.equal(res.text,'success')
        done();
      })
    });
    
    suite('DELETE', function(done) {
      chai.request(server)
      .post('/api/replies/')
      .send({
        board:'food',
        thread_id:'VSks3oM_3',
        reply_id:'o9ShJtqcO',
        delete_password:'position'
      })
      .end(function(err, res){
        assert.equal(res.status,200)
        assert.equal(res.text,'success')
        done();
      })
    });
    
  });

});
