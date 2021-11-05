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
        this.setState({pageClicked});
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
            this.setState({dataSource: []}, 
                () => this.setState({totalPagination, pageClicked, dataSource}));
        } catch (e) {
            //handle the error
            console.log(e);
        }
    }

    renderMoviesList(){
        return this.state.dataSource.map((item) => {
            const splitDate = (item.release_date).split('-');
            const year = splitDate[0];
            return (
                <div className="movie-card-box">
                    <div>
                        <img className="image-card-box shadow-bottom" src={item.poster_path} />
                        <div className="image-card-section-bottom">
                            <span className="image-card-section-bottom-title">{item.title}</span>
                            <span className="image-card-section-bottom-year">{year}</span>
                        </div>
                    </div>
                </div>
            )
        });
    }

    renderPagination(){
        let paginationView = [];
        for(let i = 1; i <= this.state.totalPagination; i++){
            paginationView.push(
                <a
                    style={{cursor: "pointer"}}
                    onClick={() => this.retrieveMovies(i)} 
                    className={i === this.state.pageClicked ? "pagination-box selected" : "pagination-box"} 
                    key={i}>
                        {i}
                </a>
            );
        }
        return paginationView;
    }

    render(){
        return(
            <div className="container-main">
                <div className="container-movies-title">
                    <span className="movies-title">
                        {MOVIES_TITLE}
                    </span>
                </div>
                <div className="container-movies-main">
                    <div className="container-movies-list">
                        { this.renderMoviesList() }
                    </div>
                <div className="container-pagination">
                    <span>PAGE</span> { this.renderPagination() }
                </div>
                </div>
            </div>
        );
    }
}