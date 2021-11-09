import { useState, useEffect } from 'react';
import '@css/views/movies-menu/MoviesMenu.css';
import { 
    MOVIES_API, 
    MOVIES_TITLE, 
    AUTHENTICATION_TYPE 
} from '@utils/constants/api.contants';
import ApiService from '@services/api.service';

function MoviesMenu() {
    
    const [state, setState] = useState({
        dataSource: [],
        totalPagination: 0,
        pageClicked: 0
    });

    useEffect(() => retrieveMovies(), []);

    function retrieveMovies(pageClicked = 1) {
        if(pageClicked === state.pageClicked) return;
        setState({...state, pageClicked});
        new ApiService().get(MOVIES_API, AUTHENTICATION_TYPE.NULL, null)
            .then((res) => res.json()).then((responseJSON) => {
                const json = responseJSON;
                const totalPagination = json.length % 10 === 0 
                    ? json.length / 10 : parseInt(json.length) + 1;
                const retrieveLength = (pageClicked * 10);
                const dataSource = [];
                for(let i = (retrieveLength - 10); i < retrieveLength; i++) {
                    if(json[i]) dataSource.push(json[i]);
                }
                setState({...state, dataSource: []});
                setState({totalPagination, pageClicked, dataSource});
            }).catch((error) => {
                retryReload(retrieveMovies);
            });
    }

    function retryReload(retryTheFunction) {
        setTimeout(() => retryTheFunction(), 5000);
    }

    function renderMoviesList() {
        return state.dataSource.map((item, index) => {
            const splitDate = (item.release_date).split('-');
            const year = splitDate[0];
            return (
                <div className="movie-card-box" key={index}>
                    <div>
                        <img className="image-card-box shadow-bottom" 
                            src={item.poster_path} alt={item.title} />
                        <div className="image-card-section-bottom">
                            <span className="image-card-section-bottom-title">
                                {item.title}
                            </span>
                            <span className="image-card-section-bottom-year">
                                {year}
                            </span>
                        </div>
                    </div>
                </div>
            )
        });
    }

    function renderPagination(){
        let paginationView = [];
        for(let i = 1; i <= state.totalPagination; i++){
            paginationView.push(
                <button
                    onClick={() => retrieveMovies(i)} 
                    className={i === state.pageClicked ? 
                        "pagination-box selected" : "pagination-box"} 
                    key={i}>
                        {i}
                </button>
            );
        }
        return paginationView;
    }

    return(
        <div className="container-main">
            <div className="container-movies-title">
                <span className="movies-title">
                    {MOVIES_TITLE}
                </span>
            </div>
            <div className="container-movies-main">
                <div className="container-movies-list">
                    { renderMoviesList() }
                </div>
            <div className="container-pagination">
                <span>PAGE</span> { renderPagination() }
            </div>
            </div>
        </div>
    );
}

export default MoviesMenu;