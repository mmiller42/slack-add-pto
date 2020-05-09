import scrape from 'mini-scrape'
import querystring from 'querystring'


exports.handler = async (event, context, callback) => {
  console.log(event)
  const body = querystring.parse(event.body)
  console.log(body)

  let response = {}
  if (body.text) {
    const window = await scrape(body.text)
    console.log(window)
    response = {
      "text": window.document.title,
    }
  } else {
    response = {
      "text": "Missing URL",
    }
  }

  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(response)
  })
}
