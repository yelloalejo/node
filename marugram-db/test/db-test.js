'use strict'

const test = require('ava')
const uuid = require('uuid-base62')
const Db = require('../../lib/db')
const r = require('rethinkdb')
const fixtures = ('./fixtures')

const dbName = `marugram_${uuid.v4()}`
const db = new Db({ db: dbName })

test('save image', async t => {
  t.is(typeof db.saveImage, 'function', 'saveImage is a function')

  let image = fixtures.getImage()

  let created = await db.saveImage(image)

  t.is(created.description, image.description)
  t.is(created.url, image.url)
  t.is(created.likes, image.likes)
  t.is(created.liked, image.liked)
  t.deepEqual(created.tags, [ 'awesome', 'tags', 'platzi' ])
  t.is(created.user_id, image.user_id)
  t.is(typeof created.id, 'string')
  t.is(created.public_id, uuid.encode(created.id))
  t.truthy(created.createAt)
})

test('like image', async t => {
  t.is(typeof db.likeImage, 'function', 'like image is a function')

  let image = fixtures.likeImage()
  let created = await db.saveImage(image)
  let result = await db.likeImage(created.public_id)

  t.true(result.like, image.likes + 1)
})

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

test('get image', async t => {
  t.is(typeof db.getImage, 'function', get image is a function)

  let image = fixtures.getImage()
  let created = await db.saveImage(image)
  let result = await db.getImage(created.public_id)

  t.deepEqual(created, result)
})
