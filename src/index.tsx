import ReactDOM from 'react-dom/client'
import { App } from './App.1.tsx';
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css';
import { BrowserRouter } from 'react-router-dom';



const container = document.getElementById('app');
const root = ReactDOM.createRoot(container!)
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);


