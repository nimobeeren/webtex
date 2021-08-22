const fs = require('fs')

if (process.argv.length < 3) {
  console.error('Gimme a filename!')
  return
}

let md = fs.readFileSync(process.argv[2], { encoding: 'utf-8' })
md = md.replace(/\\/g, '\\\\')
md = md.replace(/\r?\n/g, '\\n')
md = md.replace(/"/g, '\\"')
fs.writeFileSync('out.txt', md)
