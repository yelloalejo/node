'use strict'

const test = require('ava')
const uuid = require('uuid-base62')
const Db = require('../')
const r = require('rethinkdb')

const dbName = `marugram_${uuid.v4()}`
const db = new Db({ db: dbName })

test.before('setup database', async t => {
  await db.connect()
  t.true(db.connected, 'should be connect')
})

test.after('disconnect database', async t => {
  await db.disconnect()
  t.false(db.connected, 'should be disconnect')
})

test.after.always('cleanup database', async t => {
  let conn = await r.connect({})
  await r.dbDrop(dbName).run(conn)
})

test('save image', async t => {
  t.is(typeof db.saveImage, 'function', 'saveImage is a function')

let image = {
	url: 'http://marugram.test/${uuid.v4()}.jpg',
	likes: 0,
	liked: false,
	user_id: uuid.uuid(),
}

let create = await db.saveImage(image)
t.is(create.url, image.url)
t.is(create.likes, image.likes)
t.is(create.liked, image.liked)
t.is(create.user_id, image.user_id)
t.is(typeof create.id, 'string')
t.truthy(create.createAt)

})
