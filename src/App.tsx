import { BrowserRouter } from 'react-router-dom';
import AttendanceForm from './components/AttendanceForm/AttendanceForm';

function App() {
    return (
        <BrowserRouter>
            <div className="App" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px'
            }}>
                <h1>Attendance Form</h1>
                <AttendanceForm />
            </div>
        </BrowserRouter>
    );
}

export default App;



