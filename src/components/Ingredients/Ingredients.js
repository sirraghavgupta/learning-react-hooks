import React, { useState, useEffect } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [ingredientsState, setIngredientsState] = useState([]);

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
  }, []);

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
    fetch(
      "https://react-hooks-demo-app-b51ef.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        setIngredientsState((prevState) => [
          ...prevState,
          { id: responseData.name, ...ingredient },
        ]);
      });
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={ingredientsState}
          onRemoveItem={() => {}}
        />
      </section>
    </div>
  );
}

export default Ingredients;
