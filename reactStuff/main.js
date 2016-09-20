//import React from 'react'
//import {  } from 'react-dom'
//import { Router , Route , IndexRoute , browserHistory } from 'react-router'

const MainComponent = React.createClass({
  getInitialState(){
    try{
      var data = JSON.parse(localStorage.movieList);
    }catch(e){
      data = [];
    }
    return{
      movie : '',
      movObj : {},
      movieList : data
    };
  },
  componentDidUpdate(){
    //console.log(this.state.movieList);
    localStorage.movieList=JSON.stringify(this.state.movieList);
  },
  addMovie(movie){
    //console.log(movie);
    this.setState({ movieList : this.state.movieList.concat(movie) });
  },
  removeMovie(movie){
    this.setState({movieList : this.state.movieList.filter(mov => mov !== movie)});
  },
  getTitle(){
    $.ajax({
      url : '/getId',
      method : 'GET'
    }).done(obj=>{
      this.setState({movObj : obj});
      $.ajax({
        url : `http://www.omdbapi.com/?i=${obj.movieId}`,
      }).done(movieInfo=>{
        this.setState({ movie : movieInfo,button : "Add To WatchList"});
      }).fail(err=>console.log(err));
    //  this.setState({movie : obj});
  }).fail(err=>console.log(err));
    //console.log("get movie");
  },
  showlist(){
    console.log('showlist');
  },
  render(){
    return (
      <div>
        <button className="getMovieButton btn btn-primary" onClick={this.getTitle}>Get Movie</button>
        {/* <button className="btn btn-primary" data-toggle="modal" data-target="#myModal">WatchList</button> */}
        <MovieInfo
          movie={this.state.movie}
          movObj={this.state.movObj}
          addMovie={this.addMovie}
          removeMovie={this.removeMovie}/>
        <br/><br/>
        <WatchList data={this.state.movieList} removeMovie={this.removeMovie}/>
      </div>
    );
  }
});

const WatchList = React.createClass({
  delete(e){
    this.props.removeMovie(e.target.value);
  },
  render(){

      // <div id="myModal" className="modal fade" role="dialog">
      //   <div className="modal-dialog">
      //
      //     <div className="modal-content">
      //       <div className="modal-header">
      //         <button type="button" className="close" data-dismiss="modal">&times;</button>
      //         <h4 className="modal-title">Modal Header</h4>
      //       </div>
      //       <div className="modal-body">
      //         <p>Some text in the modal.</p>
      //       </div>
      //       <div className="modal-footer">
      //         <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
      //       </div>
      //     </div>
      //
      //   </div>
      // </div>
      let watchlist = this.props.data.map(movie=>{
        return (
          <tr><td>{movie}</td><td><button className="btn btn-danger btn-xs" value={movie} onClick={this.delete}>X</button></td></tr>
        );
      });
      return (
        <div>
          <h3>WatchList</h3>
          <table className="table">
            <tbody>
              {watchlist}
            </tbody>
          </table>
        </div>
      );

  }
});

const MovieInfo = React.createClass({
  getInitialState(){
    return{
      button : 'Add To WatchList',
      click : this.addTolist
    }
  },
  removeFromlist(e){
    this.props.removeMovie(e.target.value);
    //console.log('remove movie');
    this.setState({button : 'Add To WatchList',click : this.addTolist});
  },
  addTolist(e){
    this.props.addMovie(e.target.value);
    //console.log('add movie');
    this.setState({button : 'Remove From WatchList',click : this.removeFromlist});
  },
  render(){
    if(this.props.movie===''){
      return (
        <div>

        </div>
      );
    }else{

      return (
        <div className="mainDiv">
        <br/>
        <img width="251" src={this.props.movie.Poster}/>
        <p className="movieTitle">{this.props.movie.Title}</p>
        <span className="movieYear">{this.props.movie.Released} </span>
        <span className="movieRating">{this.props.movie.Rated}</span><br/><br/>
        <p>
          <a className="btn btn-default" target="_blank" href={"http://www.imdb.com/title/"+`${this.props.movie.imdbID}`}>IMDB</a>
          <button className="btn btn-default" value={this.props.movie.Title+" : "+this.props.movie.Year} onClick={this.state.click}>{this.state.button}</button>
        </p>
        <p>{this.props.movie.Runtime}</p>
        <p>{this.props.movie.Genre}</p>
        <p className="plot">{this.props.movie.Plot}</p>
        </div>
      );
    }

    // }
  }
});


ReactDOM.render(
  <MainComponent/>,
  document.getElementById('root')
);
