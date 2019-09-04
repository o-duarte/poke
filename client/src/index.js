import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import './styles/styles.css';
import { theme } from './styles/theme';
import { RootRoute } from './routes';

// Setting locale for moment library.



/*
 * Application rendering.
 */

const App = () => <RootRoute />;

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
 ,
  document.getElementById('root')
);
