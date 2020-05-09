import querystring from 'querystring'

exports.handler = async (event, context, callback) => {
  console.log(event)
  const { user_id: userId, text } = querystring.parse(event.body)

  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      response_type: 'ephemeral',
      text: `Event added to PTO calendar: ${userId}: ${text}`
    })
  })
}
