import './charList.scss';
import useMarvelService from "../../Services/MarvelService";
import {useState, useEffect, useRef } from "react";
import Spinner from "../spinner/Spinner";
import ErrorMesage from "../errorMessage/ErrorMesage";
import PropTypes from "prop-types";


const CharList = (props) => {

  const [charList, setCharList] = useState([])
  const [newItemLoading, setNewItemLoading] = useState(false)
  const [offset, setOffset] = useState(210)
  const [charEnded, setCharEnded] = useState(false)

  const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
      onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
      initial ? setNewItemLoading(false) : setNewItemLoading(true);
      getAllCharacters(offset)
            .then(onCharListLoaded)
    }

    const onCharListLoaded = (newCharList) => {
      let ended = false;
      if (newCharList < 9) {
          ended = true;
      }
      setCharList(charList => [...charList, ...newCharList])
      setNewItemLoading(false);
      setOffset(offset => offset + 9);
      setCharEnded(ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
      itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
      itemRefs.current[id].classList.add('char__item_selected');
      itemRefs.current[id].focus();
    }

    function renderCharacters(arr) {
      const characters = arr.map((item, i) => {
          let imgStyle = {'objectFit': 'cover'};
          if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
              imgStyle = {'objectFit': 'unset'};
          }
          return (
              <li
                  ref={el => itemRefs.current[i] = el}
                  key={item.id}
                  className="char__item"
                  onClick={() => {
                      props.onCharSelected(item.id);
                      focusOnItem(i)
                  }}
                  onKeyPress={(e) => {
                  if (e.key === ' ' || e.key === "Enter") {
                      props.onCharSelected(item.id);
                      focusOnItem(i);
                  }
              }}>
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


    const characters = renderCharacters(charList);
    const errorMessage = error ? <ErrorMesage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
      <div className="char__list">
        <ul className="char__grid">
          {errorMessage}
          {spinner}
          {characters}
        </ul>
        <button
          className="button button__main button__long"
          disabled={newItemLoading}
          style={{display: charEnded ? 'none' : 'block'}}
          onClick={() => onRequest(offset)}>
          <div className="inner">load more</div>
        </button>
      </div>
    )
    
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
}

export default CharList;