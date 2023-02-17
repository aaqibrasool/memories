import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { createStore, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"
import reducers from "./redux/reducers/index"

import App from "./App"

import "./index.css"

const store = createStore(reducers, compose(applyMiddleware(thunk)))
const rootElement = document.getElementById("root")
const root = createRoot(rootElement)

function AppCb({ callback }) {
  return <App />
}

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <AppCb callback={() => console.log("ren")} />
    </BrowserRouter>
  </Provider>
)
