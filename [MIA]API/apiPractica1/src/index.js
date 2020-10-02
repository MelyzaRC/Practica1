const express =  require('express');
const app = express();

//settings
app.set('port', process.env.PORT || 3000);

//Middelwares
app.use(express.json());

//Routes
app.use(require('./routes/consultas'));

//Startin the server
app.listen(app.get('port'), () => {
    console.log("Serven on port", app.get('port'));
});

