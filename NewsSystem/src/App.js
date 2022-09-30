import React from 'react';
import IndexRouter from './router/indexRouter';
import './App.css';
import { Provider } from 'react-redux';
import store from './redux/store';


export default function App() {
  return (
    <Provider store={store}>
      <IndexRouter></IndexRouter>
    </Provider>
  )
}