import {useCallback, useReducer} from 'react';

const httpReducer = (httpState, action) => {
	switch (action.type) {
		case 'SEND':
			return {loading: true, error: null, data: null};
		case 'RESPONSE':
			return {...httpState, loading: false, data: action.data};
		case 'DELETE_RESPONSE':
			return {...httpState, loading: false, deleteId: action.deleteId, submitId: null};
		case 'SUBMIT_RESPONSE':
			return {...httpState, loading: false, submitId: action.submitId, deleteId: null, data: action.data};
		case 'ERROR':
			return {...httpState, loading: false, error: action.error, submitId: null, deleteId: null};
		case 'RESET':
			return {loading: false, error: null, data: null, submitId: null, deleteId: null};
		default:
			throw new Error('Should not come here');
	}
}

const useHttp = () => {

	const [httpState, httpDispatch] = useReducer(httpReducer,
		{loading: false, error: null, data: null, deleteId: null, submitId: null });

	const sendRequest = useCallback(  (url, method, body, process) => {
		httpDispatch({type: 'SEND'});
		fetch(url, {
			method: method,
			body: body,
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((response) => {
			return response.json();
		}).then(responseData => {
			if ( process !== null) {
				process(responseData);
			}

			if(method === 'DELETE') {
				const urlSplitter = url.split("/");
				const id = urlSplitter[urlSplitter.length-1].split(".")[0];
				httpDispatch({type: 'DELETE_RESPONSE', deleteId: id});
			} else if (method === 'POST') {
				httpDispatch({type: 'SUBMIT_RESPONSE', submitId: responseData, data: JSON.parse(body)});
			} else {
				httpDispatch({type: 'RESPONSE', data: responseData});
			}
		}).catch(error => {
			httpDispatch({type: 'ERROR', error: error.message});
		});

	}, []);
	return {
		loading: httpState.loading,
		error: httpState.error,
		submitId: httpState.submitId,
		deleteId: httpState.deleteId,
		data: httpState.data,
		sendRequest: sendRequest
	}
};

export default useHttp;
