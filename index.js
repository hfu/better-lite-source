const Database = require('better-sqlite3')
const fs = require('fs')
const wkx = require('wkx')

if (process.argv.length !== 3) {
  console.log('usage: node index.js some.sqlite')
  process.exit()
} else {
  if (!fs.existsSync(process.argv[2])) {
    console.log(`${process.argv[2]} does not exist.`)
    process.exit()
  }
}

const db = new Database(process.argv[2], {readonly: true})
const stmt = db.prepare(`SELECT * FROM points`)
for (let row of stmt.iterate()) {
  const g = wkx.Geometry.parse(row.GEOMETRY)
  console.log(g.toGeoJSON())
  
}

