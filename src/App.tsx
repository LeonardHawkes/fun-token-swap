import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TokenSwap from './components/TokenSwap/TokenSwap';

function App() {
  return (
    <div className="App">
      <header className='bg-dark text-white py-3 mb-4'>
        <div className='container'>
          <div className='d-flex justify-content-between align-items-center'>
            <h1 className='mb-0'>Crypto Token Swap</h1>
            <span className='badge bg-primary'>Preview Mode</span>
          </div>
        </div>
      </header>

      <main className='container mb-5'>
        <TokenSwap />
      </main>

      <footer className='bg-light py-3 mt-5'>
        <div className='container text-center text-muted'>
          <p className='mb-0'>Disclaimer: This is a demo application created by Leonard Hawkes. Token prices are for demonstration purposes only.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
