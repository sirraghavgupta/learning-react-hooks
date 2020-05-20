import React, { useState } from "react";

import Card from "../UI/Card";
import "./IngredientForm.css";
import LoadingIndicator from "../UI/LoadingIndicator";

const IngredientForm = React.memo((props) => {
  /**
   * in useStatem, we can passs anything like object, string, number, unlike the
   * state in class based components where wwe need object only.
   *
   * here we take amount to be string, though we know that its a number because
   * after all from input, it always comes a string and hence its better to keep
   * string as otherwise it may create some problem,
   *
   * now, useState returns an array which always and always contains 2 elements.
   * the first one is the initial state in the first render cycle and the
   * updated state in subsequent render cycles.
   * in every re render, the function is executed again and hence the
   * useState is also again executed. but now, it doesnt re initialise the state
   * with the old state but with the new state. as it manages the state separately,
   * detached from the component.
   *
   * so, we take the state to be const as we are not explicitly re initilising it.
   * when the function is re rendered, useState runs again and then its
   * re initialised but thats ok as we know that its a new constant now.
   *
   * useState doesnt merge the state with the old one, it re initialises that.
   * so, we need to merge it on our own. and also as we are just using the
   * previous state in the new state, we must use an arrow function.
   *
   * ====== RULES OF USING REACT HOOKS ======
   * we need to use the hooks always at the root level of the functional
   * component. not inside any if else block or not inside any function.
   *
   * also, we can use the hooks either inside the functional component or in
   * the other custom hooks made by us.
   */
  const [titleState, setTitleState] = useState({ title: "" });
  const [amountState, setAmountState] = useState({ amount: "" });

  const submitHandler = (event) => {
    event.preventDefault();
    props.onAddIngredient({ ...titleState, ...amountState });
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={titleState.title}
              onChange={(event) => {
                setTitleState({ title: event.target.value });
              }}
            />
          </div>

          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={amountState.amount}
              onChange={(event) => {
                setAmountState({ amount: event.target.value });
              }}
            />
          </div>

          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.showSpinner && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
