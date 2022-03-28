import {useState, useEffect} from 'react';
import './comicsList.scss';
import useMarvelService from '../../Services/MarvelService';
import Spinner from "../spinner/Spinner";
import ErrorMesage from "../errorMessage/ErrorMesage";
import { Link } from 'react-router-dom';

const ComicsList = () => {

  const [comicsList, setComicsList] = useState([])
  const [newItemLoading, setNewItemLoading] = useState(false)
  const [offset, setOffset] = useState(210)
  const [comicsEnded, setComicsEnded] = useState(false)

  const {loading, error, getAllComics} = useMarvelService();


  useEffect(() => {
    onRequest(offset, true)
  }, [])

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComics(offset)
          .then(onCharListLoaded)
  }
  
  const onCharListLoaded = (newComicsList) => {
    let ended = false;
    if (newComicsList < 8) {
        ended = true;
    }
    setComicsList(comicsList => [...comicsList, ...newComicsList])
    setNewItemLoading(false);
    setOffset(offset => offset + 9);
    setComicsEnded(ended);
  }
  
  function renderComics(comicsArray) {
    const comics = comicsArray.map((item, i) => {
      return (
        <li className="comics__item" key={i}>
          <Link to={`/comics/${item.id}`}>
            <img src={item.image} alt={item.title} className="comics__item-img"/>
            <div className="comics__item-name">{item.title}</div>
            <div className="comics__item-price">{item.price}</div>
          </Link>
        </li>
      )
    })
    return (
      <ul className="comics__grid">
        {comics}
      </ul>
    )
  }

  const comics = renderComics(comicsList);
  const errorMessage = error ? <ErrorMesage/> : null;
  const spinner = loading && !newItemLoading ? <Spinner/> : null;
    return (
        <div className="comics__list">
          {errorMessage}
            {spinner}
          {comics}
            <button 
              className="button button__main button__long"
              disabled={newItemLoading}
              style={{display: comicsEnded ? 'none' : 'block'}}
              onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;