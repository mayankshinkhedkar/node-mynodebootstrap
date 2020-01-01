export let userName = (req, res, next) => {
  res.send({
    success: true,
    data: 'Hey I\'m User!!!',
    message: 'Success'
  })
}

export let userCountry = (req, res, next) => {
  res.send({
    success: true,
    data: 'India',
    message: 'Success'
  })
}

export let userAdd = (req, res, next) => {
  const {
    access_token
  } = req.headers;

  let resPayload = {
    success: false,
    data: [],
    message: 'Invalid Access'
  }

  if (access_token) {
    resPayload.success = true;
    resPayload.data = req.body;
    resPayload.message = 'Success';

  }

  res.send(resPayload)
}