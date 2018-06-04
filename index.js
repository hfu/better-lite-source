const Database = require('better-sqlite3')
const fs = require('fs')
const wkx = require('wkx')

if (process.argv.length !== 4) {
  console.log('usage  : node index.js some.sqlite some_relation')
  console.log('example: node index.js 0-0-0.sqlite points')
  process.exit()
} else {
  if (!fs.existsSync(process.argv[2])) {
    console.log(`${process.argv[2]} does not exist.`)
    process.exit()
  }
}

const db = new Database(process.argv[2], {readonly: true})
const stmt = db.prepare(`SELECT * FROM ${process.argv[3]}`)
let count = 0
for (let row of stmt.iterate()) {
  const g = wkx.Geometry.parse(row.GEOMETRY).toGeoJSON()
  delete row.GEOMETRY
  count ++
  if (count % 100000 === 0) console.error(`${count}`)
  let f = {
    type: 'Feature',
    geometry: g,
    properties: row,
    tippecanoe: {
      layer: g.type.toLowerCase().replace('multi', '')
    }
  }
  console.log(JSON.stringify(f))
}
console.error(count)
