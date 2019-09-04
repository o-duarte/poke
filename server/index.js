import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
const request = require('request-promise');

const app = express();
const router = express.Router();

// Applying basic middlewares.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

 app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function filterData(item){
  const pokemon = JSON.parse(item)
      var types = ''
      var abilities = '' 
      pokemon.abilities.forEach(element => {
        if(abilities.length === 0){
          abilities=element.ability.name
        }
        else{
          abilities=abilities+"/"+element.ability.name
        }
      })
      pokemon.types.forEach(element => {
        if(types.length === 0){
          types=element.type.name
        }
        else{
          types=types+"/"+element.type.name
        }
      });
    return ({
        id: pokemon.id,
        name: pokemon.name,
        weight: pokemon.weight,
        types: types,
        abilities: abilities,
        picURL: pokemon.sprites.front_default
    })
}

function evolutions(set){
  return set.map(item => ({
    name: item.species.name, 
    id: item.species.url.split("/")[6],
    evolves_to: evolutions(item.evolves_to),
  }))
}
  
function filterChain(chain){
  var pokemon = {
    name: chain.chain.species.name, 
    id: chain.chain.species.url.split("/")[6]
  }
  pokemon.evolves_to = evolutions(chain.chain.evolves_to)
  return pokemon

}

app.get('/api/pokelist/:page', function(req,res) {
  const path = "https://pokeapi.co/api/v2/pokemon/"
  var urls = []
  const start = req.params.page*20+1
  for(var i=start;i<start+20;i++){
    if(i>806){
      var n = i-806+10000
      urls.push(path+n)
    }
    else{
      urls.push(path+i)
    }  
  }
  const promises = urls.map(url => request(url));
  Promise.all(promises).then((data) => {
    var pokelist = []
    data.forEach((item, index)=>{
      
      pokelist.push(filterData(item))
    })
    if(Math.random()>0.9){
      res.status(500).send({ error: 'Something is broken!' });
    }
    else{
      res.send(pokelist)
    }
  });
  
})

app.get('/api/poke/:id', function(req,res){
  const path = "https://pokeapi.co/api/v2/pokemon/"
  request(path+req.params.id)
  .then((data)=>{
    var pokemon = filterData(data);
    request(JSON.parse(data).species.url)
    .then((singlepkmn) => {
      singlepkmn = JSON.parse(singlepkmn)
      //find first english text 
      pokemon.description =  singlepkmn.flavor_text_entries.find((element) => {
        return element.language.name == "en"
      }).flavor_text
      request(singlepkmn.evolution_chain.url)
      .then((chain) =>{
        chain = JSON.parse(chain)
        pokemon.evolution_chain = filterChain(chain)
        res.send(pokemon)
      })
    }   
    )
    
  })
})

/*
 * Static File server setup.
 */

// All files must be in the build client directory.
const staticFiles = express.static(path.join(__dirname, '../../client/build'));
app.use(staticFiles);

// Any routes not picked up by the server api will be handled by the react router
app.use('/*', staticFiles);

// Setup port and running.
app.set('port', process.env.PORT || 3001);

app.listen(app.get('port'), () => {
  console.log(`pokeapi app running on ${app.get('port')}`);
});

