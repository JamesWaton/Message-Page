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

	let testThreadId
	let testReplyId
	let testPass = 'testpass'

	test('Create a New Thread', (done) => {
			chai.request(server)
				.post('/api/threads/test')
				.send({
					board: 'test',
					text: 'Functional Test Thread',
					delete_password: testPass
				})
				.end((err, res) => {
					assert.equal(res.status, 200)
					let createdThreadId = res.redirects[0].split('/')[res.redirects[0].split('/').length - 1]
					testThreadId = createdThreadId
					done()
				})
	})
//Q6 replying 
  test('Post a reply on a Thread', (done) => {
    chai.request(server)
    .post('/api/replies/test')
    .send({
      thread_id: testThreadId,
      text: 'Test Reply from Functional Test',
      delete_password: testPass
    })
    .end((err, res) => {
      //when chai tests this it will be 200 rather than 302 as there is no caching 
      assert.equal(res.status, 200)
      //collecting from url 
      let createdReplyId =  res.redirects[0].split('=')[res.redirects[0].split('=').length - 1]
      testReplyId = createdReplyId
      done()
    })
  })
  

//Q7

	test('Get Threads from a Board', (done) => {
		chai.request(server)
		.get('/api/threads/test')
		.send()
		.end((err, res) => {
			assert.isArray(res.body)
			let firstThread = res.body[0]
			assert.isUndefined(firstThread.delete_password)
			assert.isAtMost(firstThread.replies.length, 3)
			done()
		})
	})




//Q8
test('Get Replies on a Thread', (done) => {
		chai.request(server)
		.get('/api/replies/test')
		.query({thread_id: testThreadId})
		.send()
		.end((err, res) => {
			let thread = res.body
			assert.equal(thread._id, testThreadId)
			assert.isUndefined(thread.delete_password)
			assert.isArray(thread.replies)
			done()
		})
	})

	test('Report a Thread', (done) => {
		chai.request(server)
			.put('/api/threads/test')
			.send({
				thread_id: testThreadId,
			})
			.end((err, res) => {
				assert.equal(res.body, 'success')
				done()
			})
	})

 //Q12 report a reply and change its reported value to true 
test('Report a Reply on a Thread', (done) => {
		chai.request(server)
			.put('/api/replies/test')
			.send({
				thread_id: testThreadId,
				reply_id: testReplyId
			})
			.end((err, res) => {
				assert.equal(res.body, 'success')
				done()
			})
	})


//Q10
	test('Delete a Reply on a Thread', (done) => {
		chai.request(server)
			.delete('/api/replies/test')
			.send({
				thread_id: testThreadId,
				reply_id: testReplyId,
				delete_password: testPass
			})
			.end((err, res) => {
				assert.equal(res.body, 'success')
				done()
			})
	})

//Q9 
test('Delete a Thread', (done) => {
		chai.request(server)
			.delete('/api/threads/test')
			.send({
				thread_id: testThreadId,
				delete_password: testPass
			})
			.end((err, res) => {
				assert.equal(res.body, 'success')
				done()
			})
	})

});