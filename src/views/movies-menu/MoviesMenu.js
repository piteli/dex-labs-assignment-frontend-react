import React from 'react';
import '@css/views/movies-menu/MoviesMenu.css';
import { MOVIES_API, MOVIES_TITLE } from '@utils/constants/api.contants';

export default class MoviesMenu extends React.Component {
    constructor(){
        super();
        this.loadStates();
    }

    loadStates(){
        this.state = {
            dataSource: [] ,
            totalPagination: 0,
            pageClicked: 0
        };
    }

    componentDidMount(){
        this.retrieveMovies();
    }

    async retrieveMovies(pageClicked = 1){
        if(pageClicked === this.state.pageClicked) return;
        try {
            const response = await fetch(
                MOVIES_API,
                {
                    headers : {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );
            const json = await response.json();
            const totalPagination = json.length % 10 === 0 
                ? json.length / 10 : parseInt(json.length) + 1;
            const retrieveLength = (pageClicked * 10);
            const dataSource = [];
            for(let i = (retrieveLength - 10); i < retrieveLength; i++){
                if(json[i]) dataSource.push(json[i]);
            }
            this.setState({totalPagination, pageClicked, dataSource});
        } catch (e) {
            //handle the error
            console.log(e);
        }
    }

    renderMoviesList(){
        return this.state.dataSource.map((item) => (
                <div className="movie-card-box">
                    {item.title}
                </div>
        ));
    }

    renderPagination(){
        let paginationView = [];
        for(let i = 1; i <= this.state.totalPagination; i++){
            paginationView.push(
                <div onClick={() => this.retrieveMovies(i)} className="pagination-box" key={i}>{i}</div>
            );
        }
        return paginationView;
    }

    render(){
        return(
            <div>
                <div className="container-movies-title">
                    <span className="movies-title">
                        {MOVIES_TITLE}
                    </span>
                </div>
                <div className="container-movies-main">
                    <div className="container-movies-list">
                        { this.renderMoviesList() }
                    </div>
                    { this.renderPagination() }
                </div>
            </div>
        );
    }
}