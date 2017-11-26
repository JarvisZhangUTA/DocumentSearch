import App from './App/App';
import Add from './Add/Add';
import Search from './Search/Search';
import Article from './Article/Article';

const Routes = {
    component: App,
    childRoutes: [
        {path: '/', component: Search},
        {path: '/add', component: Add},
        {path: '/article/:id', component: Article}
    ]
};

export default Routes;