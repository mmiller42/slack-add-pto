import querystring from 'querystring'

exports.handler = async (event, context, callback) => {
  console.log(event)
  const body = querystring.parse(event.body)
  console.log(body)

  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      response_type: 'ephemeral',
      text: `Event added to PTO calendar: ${body}`
    })
  })
}
