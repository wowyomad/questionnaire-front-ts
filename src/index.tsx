import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter } from 'react-router-dom';



const container = document.getElementById('app');
const root = ReactDOM.createRoot(container!)
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);


