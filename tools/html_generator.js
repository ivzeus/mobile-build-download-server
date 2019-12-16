const fs = require('fs')
const builder = require('xmlbuilder')

function buildHTML(name, appUrl, iconUrl, description) {
  const html = {
    html: {
      head: {
        title: { '#text': name },
        link: { '@rel': 'stylesheet', '@href': '/stylesheets/style.css' },
        meta: {
          '@name': 'viewport',
          '@content': 'width=device-width, initial-scale=1.0',
        },
      },
      body: [
        { img: { '@src': iconUrl, '@style': 'width:100%;' } },
        { h1: { '#text': `${name}` } },
        { p: { '#text': 'Please click the link below to install app' } },
        { a: { '@href': appUrl, '#text': 'Install app' } },
        { br: {} },
        { p: { '#text': description } },
        { br: {} },
        { br: {} },
        { a: { '@href': '/builds', '#text': 'Back' } },
        { br: {} },
      ],
    },
  }

  const xml = builder
    .create(html, {
      commentAfter: 'abc',
      encoding: 'UTF-8',
      separateArrayItems: true,
    })
    .end({ pretty: true })

  console.log(xml)
}

// how to use?
// node html_generator.js [name] [appUrl] [iconUrl]
if (process.argv.length < 5) {
  console.log(
    'Usage: node tools/html_generator.js [name] [appUrl] [iconUrl] (desc)'
  )
} else {
  const name = process.argv[2]
  const appUrl = process.argv[3]
  const iconUrl = process.argv[4]
  let desc
  if (process.argv.length >= 6) desc = process.argv[5]
  buildHTML(name, appUrl, iconUrl, desc)
}
