import './App.css';
import { Route, Routes } from 'react-router-dom';
import { routing } from './constants/routing';
import 'toastr/build/toastr.min.css';
import toastr from 'toastr';

// Configure Toastr
toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: false,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut"
};

function App() {
  return (
    <Routes>
      {
        routing.map((i) => (
          <Route path={i.link} key={i.id} element={i.element} />
        ))
      }
    </Routes>
  );
}

export default App;
