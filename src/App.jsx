import React, { Component } from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import RTFInput from './Components/RTFInput/RTFInput.jsx';

// @observer
class App extends Component {
  render() {
    return (
      <div style={{maxWidth: '400px', margin: '20px'}}>
        <RTFInput
            value="Test Value"
            className="be-rtf-editor"
            onBlur ={(e, value, rtfInput) => console.log(e, value, rtfInput)}
            onFocus={(e, value, rtfInput) => console.log(e, value, rtfInput)}
            onChange={(value) => console.log(value)}
        />
          <hr />
          <button className="btn btn-primary">Button</button>
        <DevTools />
      </div>
    );
  }

  // onReset = () => {
  //   this.props.appState.resetTimer();
  // }
}

export default App;
