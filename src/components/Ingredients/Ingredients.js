import React, {useEffect, useState, useReducer, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../hooks/http";

const ingredientsReducer = (ingredients, action) => {
	switch (action.type) {
		case 'ADD':
			return [...ingredients, action.ing];
		case 'DELETE':
			return ingredients.filter( ing => ing.id !== action.id);
		case 'SET':
			return action.ingredients;
		default:
			throw new Error('error');
	}
};

function Ingredients() {

	const [userIngredients, dispatch] = useReducer(ingredientsReducer,[]);

	const [searchTerm, setSearchTerm] = useState('');

	const {loading, error, submitId, deleteId, data, sendRequest} = useHttp();

	/**
	 * Dispatch action on submit new ingredient
	 */
	useEffect(() => {
		console.log(submitId);
		if(submitId !== null && typeof submitId !== 'undefined') {
			dispatch({type: 'ADD', ing: {id: submitId.name, ...data}});
		}
	}, [submitId]);

	/**
	 * Dispatch action on deleting ingredient
	 */
	useEffect(() => {
		if(deleteId !== null && typeof deleteId !== 'undefined') {
			dispatch({type: 'DELETE', id: deleteId});
		}
	}, [deleteId]);

	/**
	 * Create the ingredient list
	 * @type {(function(*): void)|*}
	 */
	const formulateAndSetIngredientData = useCallback( (responseData) => {
		const ingredientsList = [];
		for (const x in responseData) {
			ingredientsList.push({
				id: x,
				title: responseData[x].title,
				amount: responseData[x].amount,
			});
		}
		dispatch({
			type: 'SET',
			ingredients: ingredientsList
		})
	}, []);

	/**
	 * componentDidMount functionality
	 */
	useEffect(() => {
		const url = 'https://react-hooks-supra-default-rtdb.firebaseio.com/ingredients.json';
		sendRequest(url, 'GET', null, formulateAndSetIngredientData);
	}, [formulateAndSetIngredientData, sendRequest]);

	/**
	 * Get data on search
	 */
	useEffect(() => {
		const query =
			searchTerm.length === 0 ?
				'' :
				`?orderBy="title"&equalTo="${searchTerm}"`;

		const url = 'https://react-hooks-supra-default-rtdb.firebaseio.com/ingredients.json' + query;
		sendRequest(url, 'GET', null, formulateAndSetIngredientData);
	}, [searchTerm, formulateAndSetIngredientData, sendRequest]);

	/**
	 * To add ingredients
	 * useCallback is used for optimization
	 * @param ingredient to add to the list
	 * @type {(function(*): Promise<void>)|*}
	 */
	const submitIngredients = useCallback(ingredient => {
		const url = 'https://react-hooks-supra-default-rtdb.firebaseio.com/ingredients.json';
		sendRequest(url, 'POST', JSON.stringify(ingredient), null);
	}, [sendRequest]);

	/**
	 * To remove ingredient based on id
	 * @param id of the ingredient to remove
	 * useCallback is used for optimatization
	 * @type {(function(*): void)|*}
	 */
	const removeIngredient = useCallback(id => {
		const url = `https://react-hooks-supra-default-rtdb.firebaseio.com/ingredients/${id}.json`;
		sendRequest(url, 'DELETE', null, null);
	}, []);

	/**
	 * To set the search input box on type
	 * @param input the search term
	 * useCallback is used for optimization
	 * @type {(function(*): void)|*}
	 */
	const performSearch = useCallback((input) => {
		setSearchTerm(input);
	}, [setSearchTerm]);

	return (
		<div className="App">

			{error && <ErrorModal onClose={() => {console.log('haha')}}>{error}</ErrorModal>}

			<IngredientForm submitIngredient={submitIngredients} loading={loading}/>

			<section>
				<Search performSearch={performSearch}/>
				<IngredientList ingredients={userIngredients} onRemoveItem={id => removeIngredient(id)} loading={loading}/>
			</section>

		</div>
	);
}

export default Ingredients;
