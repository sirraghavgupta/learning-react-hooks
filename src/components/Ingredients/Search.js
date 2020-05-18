import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const [searchKey, setSearchKey] = useState("");

  const { onLoadFilteredIngredients } = props;

  const inputRef = useRef();

  /**
   * here, whenever we type something in the search box, it starts waiting for
   * 500ms and after that it checks if the value was changed or not. if not changed
   * it will fire a request and get the data. otherwise, if in between, another
   * change was trriggered, then the later change will clear the previous
   * timeout and start waiting.
   * awesome!!
   */
  useEffect(() => {
    console.log("inside useEffect", searchKey);
    const timer = setTimeout(() => {
      console.log("inside setTimeout - prev", searchKey);
      console.log("inside setTimeout - curr", inputRef.current.value);

      /**
       * here, we need to use reference to get the current value. because
       * when i type something,  my setTimeout is setup. and the value at that
       * time ges locked up with it. because of closures. its a method inside
       * method here. so, after 500 msec,i will get the 500ms, old value and
       * hence will not be able to compare in the if condition.
       */
      if (searchKey === inputRef.current.value) {
        const query =
          searchKey.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${searchKey}"`;

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
            // comments moved to EOF. - relate here.
          });
      }
    }, 500);

    // to clear the previously running timer before starting a new one.
    return () => {
      clearTimeout(timer);
    };
  }, [searchKey, onLoadFilteredIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef} // ref is a react property, fixed name.
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

/**
 * IMPORTANT NOTE ABOUT USEFFECT -
 * it runs not after every useEffect execution, but before the next
 * useEffect execution.
 * and if we have [] as the dependencies, then it runs just before unmounting.
 */
