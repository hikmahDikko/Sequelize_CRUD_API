const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const port = 7000;

app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//database name, user name, password
const sequelize = new Sequelize('nestjs_mysql_tutorial', 'root', '@3Acc5fc5585', {
    dialect : 'mysql',
});

const blog_table = sequelize.define('blog_table', {
    title : Sequelize.STRING,
    description : Sequelize.TEXT
}, {tabbeName : "blog_table"});

blog_table.sync();

sequelize
    .authenticate()
    .then(() => {
        console.log("connection made successfully")
    }).catch((err) => {
        console.log(err)
})

app.get('/', (req,res) => {
    res.send('This is working fine')
})

app.post('/', async (req, res) => {
    const {title, description} = req.body;

    const saveBlog = blog_table.build({
        title,
        description
    })

    await saveBlog.save();
    res.send("Data posted successfully")
})

app.get('/all', async(req, res) => {
    const allData = await blog_table.findAll()
    res.json({allData})
})

app.put('/:id', async (req, res) => {
    blog_table.update({title : req.body.title, description : req.body.description}, {
        where : {
            id : req.params.id,
        }
    });

    res.send('Data updated')
})

app.delete('/:id', async (req, res) => {
    blog_table.destroy({
        where : {
            id : req.params.id,
        }
    });

    res.send('Data deleted')
})

app.listen(port, () => [
    console.log('Server starts on port ' + port)
]);