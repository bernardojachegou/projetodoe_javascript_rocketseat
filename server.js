// configurando o servidor
const express = require("express")
const server = express()


// configurar conexão com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '1291',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

// configurar servidor para apresentar arquivos estaticos
server.use(express.static('public'))

// habilitade body do formulário
server.use(express.urlencoded({extended: true}))


// configurar apresentação da página
server.get("/", function(req, res) {
    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Erro de bando de dados.")
        const donors = result.rows;
        return res.render("index.html", { donors })
    })
})

// pegar dados do formulário
server.post("/", function(req, res) {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    // coloco valores dentro do Banco de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`
    
    const values = [name, email, blood]
    
    db.query(query, values, function(err) {
        //fluxo de erro        
        if (err) return res.send("erro no banco de dados.")
        //fluxo ideal
        return res.redirect("/")
    })
 
})

// ligar o servidor e pedir acesso na porta 3000
server.listen(3000, function() {
    console.log("servidor iniciado.")
})