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
      <div>
        <RTFInput
            value="Test Value"
            style={{maxWidth: '400px', margin: '20px'}}
            className="be-rtf-editor"
            onBlur ={(e, value, rtfInput) => console.log(e, value, rtfInput)}
            onFocus={(e, value, rtfInput) => console.log(e, value, rtfInput)}
            onChange={(value) => console.log(value)}
        />
          <hr />
        <DevTools />
        <button onClick={this.toggleDirection} >
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
