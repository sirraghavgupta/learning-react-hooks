import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [ingredientsState, setIngredientsState] = useState([]);
  const [loading, setLoading] = useState(false);

  /*
  // method removed as we are doing the same thing in the search component. 
  useEffect(() => {
    fetch("https://react-hooks-demo-app-b51ef.firebaseio.com/ingredients.json")
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
        setIngredientsState(loadedIngredients);
      });
  }, []); */

  useEffect(() => {
    console.log("RENDERING INGREDIENTS", ingredientsState);
  }, [ingredientsState]);

  // need to use const here, unlike the class component where we directly
  // write the function name.
  const addIngredientHandler = (ingredient) => {
    /**
     * fetch is not a react feature, its inbuilt into the browser.
     * it by default always makes a get request, so for post request, we need
     * to configure that. initially axios used to do all this conf.
     *
     * we also, need to convert the object into the string so as to send it into
     * the string.
     * when we get the response, we also need to unpack it by using .json() on that.
     * it also returns a promise, so we use another then block.
     */
    setLoading(true);
    fetch(
      "https://react-hooks-demo-app-b51ef.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        setLoading(false);
        return response.json();
      })
      .then((responseData) => {
        setIngredientsState((prevState) => [
          ...prevState,
          { id: responseData.name, ...ingredient },
        ]);
      });
  };

  /**
   * it will now memoize the function and will not re initialise it again
   * and again.
   * we need to mention the dependency also ans we can do that safely here,
   * because react guarantees that the setState methods never change as they
   * are managed by react only.
   */
  const onFilterHandler = useCallback(
    (filteredIngredients) => {
      setIngredientsState(filteredIngredients);
    },
    [setIngredientsState]
  );

  const removeIngredientHandler = (ingredientId) => {
    setLoading(true);
    fetch(
      `https://react-hooks-demo-app-b51ef.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    ).then((response) => {
      setLoading(false);
      setIngredientsState((ingredientsState) => {
        return ingredientsState.filter(
          (ingredient) => ingredient.id !== ingredientId
        );
      });
    });
  };

  return (
    <div className="App">
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        showSpinner={loading}
      />

      <section>
        <Search onLoadFilteredIngredients={onFilterHandler} />
        <IngredientList
          ingredients={ingredientsState}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
