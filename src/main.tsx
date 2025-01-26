import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {Amplify} from "aws-amplify";
import outputs from "../amplify_outputs.json";
import App from "./App.tsx";
import CssBaseline from '@mui/material/CssBaseline';
import ColorModeProvider from "./layots/theme/ColorModeProvider.tsx";
import {Provider} from 'react-redux';
import {store} from './redux/store.ts';


Amplify.configure(outputs);
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <ColorModeProvider>
                <CssBaseline/>
                <App/>
            </ColorModeProvider>
        </Provider>
    </React.StrictMode>
);
