import React, { useState } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [ingredientsState, setIngredientsState] = useState([]);

  // need to use const here, unlike the class component where we directly
  // write the function name.
  const addIngredientHandler = (ingredient) => {
    setIngredientsState((prevState) => [
      ...prevState,
      { id: Math.random().toString(), ...ingredient },
    ]);
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
