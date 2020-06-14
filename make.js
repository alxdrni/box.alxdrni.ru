const { createBundleRenderer } = require('vue-server-renderer')
const fs = require('fs')
const path = require('path')
const find = require('find')

/*
const template = require('fs').readFileSync('./src/html/index.html', 'utf-8')
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
*/

const templatePath = find.fileSync(/\.html$/, path.join(__dirname, '/dist'))[0]
const serverBundlePath = find.fileSync(/server\..+\.json$/, path.join(__dirname, '/dist'))[0]
const clientManifestPath = find.fileSync(/client\..+\.json$/, path.join(__dirname, '/dist'))[0]

console.log(templatePath, serverBundlePath, clientManifestPath)

const template = fs.readFileSync(templatePath, 'utf-8')
const serverBundle = require(serverBundlePath)
const clientManifest = require(clientManifestPath)

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template,
  clientManifest
})

module.exports = (req, res) => {
  const context = { url: req.url }
  renderer.renderToString(context, (err, html) => {
    if (err) {
      res.status(500).end('Server error')
      return
    }
    res.end(html)
  })
}
