import React, { useReducer, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentState, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentState, action.ingredient];
    case "DELETE":
      return currentState.filter(
        (ingredient) => ingredient.id !== action.ingredientId
      );
    default:
      throw new Error("should not reach here.");
  }
};

const httpReducer = (currHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...currHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.error };
    case "CLEAR":
      return { ...currHttpState, error: null };
    default:
      throw new Error("should not reach here.");
  }
};

function Ingredients() {
  const [ingredientsState, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });

  // const [ingredientsState, setIngredientsState] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

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
    // setLoading(true);
    dispatchHttp({ type: "SEND" });
    fetch(
      "https://react-hooks-demo-app-b51ef.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        // setLoading(false);
        dispatchHttp({ type: "RESPONSE" });
        return response.json();
      })
      .then((responseData) => {
        // setIngredientsState((prevState) => [
        //   ...prevState,
        //   { id: responseData.name, ...ingredient },
        // ]);
        dispatch({
          type: "ADD",
          ingredient: { id: responseData.name, ...ingredient },
        });
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
      dispatch({ type: "SET", ingredients: filteredIngredients });
    },
    [dispatch]
  );

  const removeIngredientHandler = (ingredientId) => {
    // setLoading(true);
    dispatchHttp({ type: "SEND" });
    fetch(
      `https://react-hooks-demo-app-b51ef.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        // setLoading(false);
        dispatchHttp({ type: "RESPONSE" });
        // setIngredientsState((ingredientsState) => {
        //   return ingredientsState.filter(
        //     (ingredient) => ingredient.id !== i  ngredientId
        //   );
        // });
        dispatch({ type: "DELETE", ingredientId: ingredientId });
      })
      .catch((error) => {
        console.log(error);
        // setLoading(false);
        // setError(error.message);
        dispatchHttp({ type: "ERROR" });
      });
  };

  const clearError = () => {
    // setError(null);
    dispatchHttp({ type: "CLEAR" });
  };

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        showSpinner={httpState.loading}
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

/**
 * ============ useReducer() ============
 * when we need to set multiple related state together like 
 *   setLoading(false);
     setError(error.message);
   it works fine here because of react state batching feature. 

   but sometimes it happens that our state depends on other state 
   objects also, then it becomes a little messy. 
   there we have a better alternative. useReducer().
  
   [ it may seem similar to the redux reducer but it has no connection 
  with that. ]

  so, we make a function which takes 2params, one is the initial state and 
  the other is the action object. we need to register it with the useReducer 
  hook. and it again returns an array which contains the actual state and a 
  method which we may call 'dispatch'. it also takes the initial state as the 
  argument. 
  the useReducer will re render the component whenever our state will change. 


  ADDON - 
  we can include the reducer method inside the component also if we are 
  using props inside that. but here, we want to prevent unnecesary re 
  initialization of the reducer method. 

  finally we conclude that useREducer is just a way to clean up the code 
  if we have multiple related states to manage and they have complex operations. 
  so that we have all the logic within one place only. 
 */
