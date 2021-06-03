const app = require('./src/app')
const env = require('./src/infrastructure/config/environment')

app.set('port', env.app.port)
app.listen(app.get('port'), ()=>console.log("Servidor en el puerto: " + env.app.port))