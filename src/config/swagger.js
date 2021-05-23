const swaggers = (PORT, HOST) => {
  return {
    "/api-doc/v1": {
      definition: {
        info: {
          title: 'REST API for matchformatch',
          version: '1.0.0',
          description: 'This is the REST API for matchformatch',
        },
        host: `${HOST}:${PORT}`,
        basePath: '/api/v1',
        securityDefinitions: {
          BearerAuth: {
            type: 'apiKey',
            description: 'JWT authorization of an API',
            name: 'Authorization',
            in: 'header',
          },
        },
      },
      apis: ['./src/versions/v1/routes/*.routes.js'],
    }
  }
}

export default swaggers