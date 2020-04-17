import {
    FETCH_PROTECTED_DATA_REQUEST,
    RECEIVE_PROTECTED_DATA,
    FETCH_ARTICLE_LIST_REQUEST,
    FETCH_ARTICLE_LIST_SUCCESS,
    FETCH_ARTICLE_LIST_FAILURE
} from "../constants/constants";

import {logoutAndRedirect} from "./auth";

import axios from 'axios';


export function fetchProtectedDataRequest(){
    return {
        type: FETCH_PROTECTED_DATA_REQUEST
    };
}

export function fetchProtectedData(token) {
    return (dispatch) => {
        dispatch(fetchProtectedDataRequest());
        axios.get('/api/user', {            // todo: url need to be fixed
            headers: {
                'Authorization': token
            }
        }).then(response => response.data).then(response => {
            dispatch(receiveProtectedData(response.result));
        }).catch(err => {
            if(err.status === 401){
                dispatch(logoutAndRedirect());            // todo: wrong logic
            }
        })
    }
}

export function receiveProtectedData(data) {
    return {
        type: RECEIVE_PROTECTED_DATA,
        payload: {
            data
        }
    }
}

export function fetchArticleListRequest() {
    return {
        type: FETCH_ARTICLE_LIST_REQUEST
    }
}

export function fetchArticleListSuccess(total, articles) {
    return {
        type: FETCH_ARTICLE_LIST_SUCCESS,
        payload: {
            total,
            articles
        }
    }
}

export function fetchArticleListFailure(err) {
    return {
        type: FETCH_ARTICLE_LIST_FAILURE,
        payload: {
            status: err.status,
            statusText: err.statusText
        }
    }
}

export function fetchArticleList(page=1){
    return function (dispatch) {
        dispatch(fetchArticleListRequest());
        return axios.get('/api/article_paginate/'+page)
            .then(response => response.data)
            .then(response => {
                try{
                    dispatch(fetchArticleListSuccess(
                        response.total,
                        response.articles
                    ))
                }
                catch (err) {
                    dispatch(fetchArticleListFailure(err));
                }
            }).catch(err => {
                dispatch(fetchArticleListFailure(err));
            })
    }
}