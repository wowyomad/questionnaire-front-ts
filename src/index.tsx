import ReactDOM from 'react-dom/client'
import {App} from './components/App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'; 


const container = document.getElementById('app');
const root = ReactDOM.createRoot(container!)
root.render(<App/>);


