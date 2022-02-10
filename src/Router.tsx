import { BrowserRouter } from 'react-router-dom';
import KBarWrapper from 'components/KBarWrapper';
import { GlobalProvider } from 'context/GlobalState';
const Router = () => {
  return (
    <BrowserRouter>
      <GlobalProvider>
        <KBarWrapper />
      </GlobalProvider>
    </BrowserRouter>
  );
};

export default Router;
