import {useHttp} from '../hooks/http.hook';

const useMarvelService = () => {

  const {request, loading, error, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=3df7c0e596ced128b82dfd77b09c9e1d';
    const _baseOffset = 210;


    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getAllComics = async (offset = _baseOffset) => {
      const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
      return res.data.results.map(_transformComics);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }
    
    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const _transformCharacter = (character) => {
        return {
            id: character.id,
            name: character.name,
            description: character.description ? `${character.description.slice(0, 210)}...` : 'There is no description about  character',
            thumbnail: character.thumbnail.path + '.' + character.thumbnail.extension,
            homepage: character.urls[0].url,
            wiki: character.urls[1].url,
            comics: character.comics.items,
        }
    }

    const _transformComics = (comics) => {
      return {
        id: comics.id,
        title: comics.title,
        image: comics.images[0].path + '.' + comics.images[0].extension,
        description: comics.description || 'There is no description',
        pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
        language: comics.textObjects.language || 'en-us',
        price: comics.prices.price ? `${comics.prices.price}$` : 'not available'
      }
    }

    return {loading, error, getAllCharacters, getCharacter, getAllComics, getComic, clearError}
}

export default useMarvelService;