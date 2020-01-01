# Node JS Bootstrap
Getting Started
---------------

The easiest way to get started is to clone the repository:

```bash
# Get the latest snapshot
git clone https://github.com/mayankshinkhedkar/node-mynodebootstrap.git mynodebootstrap(<Project_Name>)

# Change directory
cd mynodebootstrap(<Project_Name>)

# Install NPM dependencies
npm install

# Create .env on root as per example.env
.env file on root

# Then simply start your app
node run watch
```

**Warning:** If you want to use some API that need https to work (for example Pinterest or facebook),
you will need to download [ngrok](https://ngrok.com/).
You must start ngrok after starting the project.

```bash
# start ngrok to intercept the data exchanged on port 8080
./ngrok http 3500
```

Next, you must use the https URL defined by ngrok, for example, `https://mynodebootstrap.ngrok.io`

**Note:** I highly recommend installing [Nodemon](https://github.com/remy/nodemon).
It watches for any changes in your  node.js app and automatically restarts the
server. It will
save you a lot of time in the long run, because you won't need to manually
restart the server each time you make a small change in code. To install, run
`npm install -g nodemon`.