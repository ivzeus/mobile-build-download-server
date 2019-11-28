const fs = require('fs')
const extract = require('ipa-extract-info')
const builder = require('xmlbuilder')

function buildManifest(err, info, raw) {
  if (err) throw err

  const appUrl = process.argv[3]
  const iconUrl = process.argv[4]
  const ipaInfo = info[0]

  const manifest = {
    plist: {
      '@version': '1.0',
      dict: [
        { key: { '#text': 'items' } },
        {
          array: {
            dict: [
              { key: { '#text': 'assets' } },
              {
                array: [
                  {
                    // appUrl
                    dict: [
                      { key: { '#text': 'kind' } },
                      { string: { '#text': 'software-package' } },
                      { key: { '#text': 'url' } },
                      { string: { '#text': appUrl } },
                    ],
                  },
                  {
                    // displayImage
                    dict: [
                      { key: { '#text': 'kind' } },
                      { string: { '#text': 'display-image' } },
                      { key: { '#text': 'url' } },
                      { string: { '#text': iconUrl } },
                    ],
                  },
                  {
                    // fullsizeImage
                    dict: [
                      { key: { '#text': 'kind' } },
                      { string: { '#text': 'full-size-image' } },
                      { key: { '#text': 'url' } },
                      { string: { '#text': iconUrl } },
                    ],
                  },
                ],
              },
              { key: { '#text': 'metadata' } },
              // missing key
              {
                dict: [
                  { key: { '#text': 'bundle-identifier' } },
                  { string: { '#text': ipaInfo.CFBundleIdentifier } },
                  { key: { '#text': 'bundle-version' } },
                  { string: { '#text': ipaInfo.CFBundleShortVersionString } },
                  { key: { '#text': 'kind' } },
                  { string: { '#text': 'software' } },
                  { key: { '#text': 'platform-identifier' } },
                  { string: { '#text': 'com.apple.platform.iphoneos' } },
                  { key: { '#text': 'title' } },
                  { string: { '#text': ipaInfo.CFBundleName } },
                ],
              },
            ],
          },
        },
      ],
    },
  }

  const xml = builder
    .create(manifest, {
      commentAfter: 'abc',
      encoding: 'UTF-8',
      separateArrayItems: true,
    })
    .end({ pretty: true })

  console.log(xml)
}

function extractIPA(path) {
  const fd = fs.openSync(path, 'r')

  extract(fd, buildManifest)
}

// how to use?
// node manifest_generator.js [ipa_path] [appUrl] [iconUrl]
if (process.argv.length !== 5) {
  console.log(
    'Usage: node tools/manifest_generator.js [ipaPath] [appUrl] [iconUrl]'
  )
} else {
  const ipaPath = process.argv[2]
  extractIPA(ipaPath)
}
