import React, { useState, useEffect } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const [searchKey, setSearchKey] = useState("");

  const { onLoadFilteredIngredients } = props;

  useEffect(() => {
    const query =
      searchKey.length === 0 ? "" : `?orderBy="title"&equalTo="${searchKey}"`;

    fetch(
      "https://react-hooks-demo-app-b51ef.firebaseio.com/ingredients.json" +
        query
    )
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        const loadedIngredients = Object.keys(responseData).map((key) => {
          return {
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount,
          };
        });
        onLoadFilteredIngredients(loadedIngredients);
        /**
         * we should always mention the variables and functions used in useEffect, in
         * the dependencies array also.
         *
         * like props.onLoadFilteredIngredients
         *
         * we may think that the function will not change and will not affect our
         * purpose if we mention that. but actually it changes because
         *
         * we have function constants and when ever the parent component will be re rendered the constant will
         * be initialised with a new function. and hence, props will change which will
         * lead to the execution of this useEffect again but  we dont want that.
         *
         * so, we dont use props here in dependencies. rather we get that particular
         * fucntion out of the props and then write it here.
         * but it will also change then.
         * so, we need to use the useCallback hook in the parent component which
         * prevents it from initialising the function again.
         */
      });
  }, [searchKey, onLoadFilteredIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={searchKey}
            onChange={(event) => setSearchKey(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
