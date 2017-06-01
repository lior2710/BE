import React, { Component } from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import RTFInput from './Components/RTFInput/RTFInput.jsx';

// @observer
class App extends Component {

  toggleDirection = e => {
    document.dir = document.dir === 'rtl' ? 'ltr' : 'rtl'
  }

  render() {
    return (
      <div style={{maxWidth: '400px', margin: '20px'}}>
        <RTFInput
            placeholder='Enter here...'
            value="Test Value"
            className="be-rtf-editor"
            onBlur ={(value, e, rtfInput) => console.log(value, e, rtfInput)}
            onFocus={(value, e, rtfInput) => console.log(value, e, rtfInput)}
            onChange={(value) => console.log(value)}
        />
          <hr />
        <DevTools />
        <button onClick={this.toggleDirection} className="btn btn-primary">
          Toggle Direction
        </button>
      </div>
    );
  }

  // onReset = () => {
  //   this.props.appState.resetTimer();
  // }
}

export default App;
