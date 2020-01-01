export let adminName = (req, res, next) => {
  res.send({
    success: true,
    data: 'Hey I\'m Admin!!!',
    message: 'Success'
  })
}

export let adminCountry = (req, res, next) => {
  res.send({
    success: true,
    data: 'India',
    message: 'Success'
  })
}

export let adminAdd = (req, res, next) => {
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