import { Page, getLayout } from './layouts/DefaultLayout';
import { AuthenticatePage, MainPage, UnlockPage } from './pages';
import { useAccount, useAccountState } from './store/main';

import './styles/index.css';

function App() {
  const account = useAccount();
  const authenticated = useAccountState();

  let Page: Page = () => <></>;
  if (!authenticated) {
    Page = account ? UnlockPage : AuthenticatePage;
  } else {
    Page = MainPage;
  }

  const Layout = getLayout(Page);

  return (
    <Layout>
      <Page />
    </Layout>
  );
}

export default App;
