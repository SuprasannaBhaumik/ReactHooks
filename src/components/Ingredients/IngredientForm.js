import React, {useState} from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from "../UI/LoadingIndicator";

const IngredientForm = React.memo(props => {

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const submitHandler = event => {
    event.preventDefault();
    props.submitIngredient({
      title: title,
      amount: amount,
    });

  };

  const amountHandler = (event) => {
    setAmount(event.target.value);
  };

  const titleHandler = (event) => {
    setTitle(event.target.value);
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={title} onChange={titleHandler}/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={amount} onChange={amountHandler}/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit" onSubmit={submitHandler}>Add Ingredient</button>
            {props.loading && <LoadingIndicator/>}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
