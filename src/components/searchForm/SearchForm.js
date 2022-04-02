import React, {useState} from 'react'
import { Formik, Form, ErrorMessage as FormikErrorMessage, Field } from 'formik'
import * as yup from 'yup'
import useMarvelService from '../../Services/MarvelService'
import ErrorMesage from '../errorMessage/ErrorMesage'
import {Link} from 'react-router-dom'

import './searchForm.scss'

const SearchForm = () => {

  const [char, setChar] = useState(null);
  const {loading, error, getCharacterByName, clearError} = useMarvelService();

  const onCharLoaded = (char) => {
      setChar(char);
  }

  const updateChar = (name) => {
      clearError();

      getCharacterByName(name)
          .then(onCharLoaded);
  }

  const errorMessage = error ? <div className="char__search-critical-error"><ErrorMesage /></div> : null;
  const results = !char ? null : char.length > 0 ?
                  <div className="char__search-wrapper">
                      <div className="char__search-success">There is! Visit {char[0].name} page?</div>
                      <Link to={`/characters/${char[0].id}`} className="button button__secondary">
                          <div className="inner">To page</div>
                      </Link>
                  </div> : 
                  <div className="char__search-error">
                      The character was not found. Check the name and try again
                  </div>;

  return (
      <div className="char__search-form">
          <Formik
              initialValues = {{
                  charName: ''
              }}
              validationSchema = {yup.object({
                  charName: yup.string().required('This field is required')
              })}
              onSubmit = { ({charName}) => {
                  updateChar(charName);
              }}
          >
              <Form>
                  <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
                  <div className="char__search-wrapper">
                      <Field 
                          id="charName" 
                          name='charName' 
                          type='text' 
                          placeholder="Enter name"/>
                      <button 
                          type='submit' 
                          className="button button__main"
                          disabled={loading}>
                          <div className="inner">find</div>
                      </button>
                  </div>
                  <FormikErrorMessage component="div" className="char__search-error" name="charName" />
              </Form>
          </Formik>
          {results}
          {errorMessage}
      </div>
  )
}

export default SearchForm
