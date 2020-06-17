const { createBundleRenderer } = require('vue-server-renderer')
const fs = require('fs')
const path = require('path')

module.exports = (req, res) => {
  try {
    if (fs.existsSync(path.join(__dirname, '/dist/server.json') && path.join(__dirname, '/dist/client.json'))) {
      const template = fs.readFileSync(path.join(__dirname, '/src/templates/index.html'), 'utf-8')
      const serverBundle = require(path.join(__dirname, '/dist/server.json'))
      const clientManifest = require(path.join(__dirname, '/dist/client.json'))

      const renderer = createBundleRenderer(serverBundle, {
        runInNewContext: false,
        template,
        clientManifest
      })

      const context = { url: req.url }

      renderer.renderToString(context, (err, html) => {
        if (err) {
          res.status(500).end('Server Error')
          return
        }
        res.end(html)
      })
    } else {
      const indexFile = fs.readFileSync(path.join(__dirname, '/dist/index.html'), 'utf-8')
      res.end(indexFile)
    }
  } catch (err) {
    console.error(err)
  }
}
