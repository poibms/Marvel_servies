import './charList.scss';
import MarvelService from "../../Services/MarvelService";
import {Component} from "react";
import Spinner from "../spinner/Spinner";
import ErrorMesage from "../errorMessage/ErrorMesage";

class CharList extends Component {

    state = {
        charList: [],
        loading: true ,
        error: false,
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.marvelService.getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    onCharListLoaded = (charList) => {
        this.setState({
            charList: charList,
            loading: false
        });
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    renderCharacters(arr) {
        const characters = arr.map((item) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return(
                 <li key={item.id} className="char__item">
                    <img src={item.thumbnail} alt="abyss" style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })
        return (
            <ul className="char__grid">
                {characters}
            </ul>
        )
    }

    render() {
        const { charList, loading, error } = this.state;

        const characters = this.renderCharacters(charList);
        const errorMessage = error ? <ErrorMesage /> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? characters : null;

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {errorMessage}
                    {spinner}
                    {content}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;