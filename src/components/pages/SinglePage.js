import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ErrorMesage from "../errorMessage/ErrorMesage";
import useMarvelService from "../../Services/MarvelService";
import Spinner from '../spinner/Spinner';
import AppBanner from "../appBanner/AppBanner";
import './singlePage.scss';

const SinglePage = ({Component, type}) => {
    const {id} = useParams();
    const [data, setData] = useState(null);
    const {loading, error, getComic, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateComic()
    }, [id])

    const updateComic = () => {
        clearError();

        // eslint-disable-next-line default-case
        switch (type) {
          case 'comic':
            getComic(id).then(onDataLoaded);
            break;
          case 'character':
            getCharacter(id).then(onDataLoaded);
        }
        
    }

    const onDataLoaded = (comic) => {
        setData(comic);
    }

    const errorMessage = error ? <ErrorMesage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !data) ? <Component data={data}/> : null;

    return (
        <>
            <AppBanner/>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

export default SinglePage;