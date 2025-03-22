import { createRoot } from 'react-dom/client'
import './Login.css'
import './SignUp.css'
import './Homepage.css'
import Back from './back.jsx'
function App(){
return (createRoot(document.getElementById('root')).render(
   <Back/>
));
}
export default App;