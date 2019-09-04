import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button'
import { withRouter } from "react-router-dom";


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    maxHeight: 500,
    overflowY: 'scroll'
  };
}


function createData(id, name, picURL, types, abilities) {
    return { id: id, name, picURL, types, abilities };
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  padding:{
    paddingLeft: 20,
    borderLeft: '2px solid black'
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  centered:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto'
  },
  button: {
    margin: theme.spacing(1),
  },

});

class preEvolution extends React.Component {
  render() {
    console.log(this.props)
    const {classes, chain} = this.props
    return (
      <div>
        {chain.map((P) => {
          return(
            <div className={classes.padding}> 
              <Typography>{P.name} </Typography>
              <img src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+P.id+".png"}  alt=""/>
              {P.evolves_to.length > 0 && 
                <Evolution chain={P.evolves_to}/>
              }
            </div>
          )
        })}
      </div>
    )
  }
}

const Evolution = withStyles(styles)(preEvolution)

class preEvolutions extends React.Component {

  render() {
    console.log(this.props)
    const {classes, chain} = this.props
    return (
      <div > 
        <Typography>{chain.name} </Typography>
        <img src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+chain.id+".png"} alt=""/>
        {chain.evolves_to.length > 0 && 
          <Evolution chain={chain.evolves_to}/>
        }
      </div>
    )
  }
}

const Evolutions = withStyles(styles)(preEvolutions)


class CustomPaginationActionsTable extends React.Component {
  state = {
    rows: [],
    page: 0,
    rowsPerPage: 20,
    open: false,
    singleData: {},
    error: false,
    errordesc: ""
  };

  handleOpen = (id) => {
    this.getPokemon(id)
  };

  handleClose = () => {
      this.setState({ open: false });
  };

  handleChangePage = (inc) => {
    var newpage =  parseInt(this.props.page)+inc
    this.props.history.push(`/pokelist/${newpage}`);
  };

  handleChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };

  getPokemons(page){
    fetch( "http://localhost:3001/api/pokelist/" + page , {
      method: "GET",
      headers:{'Content-Type': 'application/json'}
    })
    .then((response) => {
        if(response.ok){
            return response.json();}
        else  {
          this.setState({error: true})
          throw new Error("GET Failed")
        }
    }).then((responseBody) => {
        //here are the result
        //console.log(responseBody)        
        var rows =[]
        responseBody.forEach(p => {
          rows.push(createData(p.id, p.name, p.picURL, p.types, p.abilities))
        });
        this.setState({rows})
    })
  }

  getPokemon(id){
    fetch( "http://localhost:3001/api/poke/" + id , {
      method: "GET",
      headers:{'Content-Type': 'application/json'}
    })
    .then((response) => {
      if(response.ok){
          return response.json();}
      else  {
        return response.json()
      }
    })
    .then((responseBody) => {
      //here are the result
      console.log(responseBody)
      if(responseBody.error){
              this.setState({error: true, errordesc: responseBody.error})
      }
      else{
       var rows =[]
       responseBody.forEach(p => {
         rows.push(createData(p.id, p.name, p.picURL, p.types, p.abilities))
       });
              this.setState({rows})
      }
    })
  }


  componentWillMount() {
    this.getPokemons(this.props.page)
  }

  render() {
    const { classes } = this.props;
    const { rows, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    if(this.state.error){
      return(
        <div>
          ERROR
          {this.state.errordesc}
        </div>
        )
    }
    return (
      <div>
       <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
      >
          <div style={getModalStyle()} className={classes.paper}>
            <div>
              <img src={this.state.singleData.picURL} alt=""/>
                <Typography variant="h5" id="modal-title" >
                    {this.state.singleData.name} 
                </Typography>
                <Divider/>
                <Typography variant="h6" >
                    ID : {this.state.singleData.id} 
                </Typography>
                <Divider/>
                <Typography variant="h6" >
                    Description : {this.state.singleData.description} 
                </Typography>
                <Divider/>
                <Typography variant="h6">
                    Types : {this.state.singleData.types} 
                </Typography>
                <Divider/>
                <Typography variant="h6" >
                    Abilities : {this.state.singleData.abilities} 
                </Typography>
                <Divider/>
                <Typography variant="h6" >
                    Evolution Chain
                </Typography>
                <Evolutions chain={this.state.singleData.evolution_chain}/>
              </div>  
          </div>
      </Modal>
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow >
                <TableCell> </TableCell>
                <TableCell align="left"># Pokedex</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Types</TableCell>
                <TableCell align="left">Abilities</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.id} hover onClick={()=>{this.handleOpen(row.id)}}>
                  <TableCell component="th" scope="row"> 
                      <img src={row.picURL} alt=""/>
                  </TableCell>
                  <TableCell align="left">{row.id}</TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">{row.types}</TableCell>
                  <TableCell align="left">{row.abilities}</TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Paper>
        <div className={classes.centered}>
          {this.props.page > 0 && 
            <Button variant="contained" className={classes.button} onClick={() =>  {this.handleChangePage(-1) }}>
              Prev
            </Button>
          }
          {this.props.page < 41 && 
            <Button variant="contained" className={classes.button} onClick={() =>  {this.handleChangePage(+1) }}>
              Next
            </Button>
          }
        </div>        
        
      </div>
    );
  }
}

CustomPaginationActionsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(CustomPaginationActionsTable));