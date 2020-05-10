const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const replaceInFile = require('replace-in-file')

const run = async () => {
  const readFile = promisify(fs.readFile)

  const { version: needleVersion } = JSON.parse(
    await readFile(require.resolve('needle/package.json'), { encoding: 'utf8' }),
  )

  await replaceInFile({
    files: path.join(__dirname, 'functions', 'add-pto.js'),
    from: /JSON\s*\.\s*parse\s*\(\s*fs\s*\.\s*readFileSync\s*\(\s*__dirname\s*\+\s*'\/\.\.\/package\.json'\s*\)\s*\.\s*toString\s*\(\s*\)\s*\)\s*\.\s*version/,
    to: JSON.stringify(needleVersion),
  })
}

run()
  .then(() => console.log('Finished post-build'))
  .catch(err => {
    console.error('Post-build failed', err)
    process.exit(1)
  })
