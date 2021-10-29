import Router from './router';
import Route from './router/route';
import LoadingView from './views/loading-view';
import user from './storage/user';
import App from './core/app';
import ErrorPage from './views/errorpage';
import registerValidSW from './modules/service-worker';
import MainPageView from './views/main-page';

registerValidSW('/sw.js');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        user.update();
    } catch {

    }

    App.setup(
        <Router routes={[
            new Route({
                url: '/',
                component: async () => { return { default: MainPageView }; },
                title: 'Главная страница',
                name: 'main'
            }),
            new Route({
                url: '/signin',
                component: async () => await import('views/signin'),
                title: 'Войти',
                name: 'signin'
            }),
            new Route({
                url: '/signup',
                component: async () => await import('views/signup'),
                title: 'Регистрация',
                name: 'signup'
            }),
            new Route({
                url: '/components',
                component: async () => await import('views/component-gallery'),
                title: 'Галерея компонентов',
                name: 'component-gallery'
            }),
            new Route({
                url: '/creator/*',
                component: async () => await import('views/creator'),
                title: 'Страница автора',
                name: 'creator'
            }),
            new Route({
                url: '/loading-view',
                component: async () => { return { default: LoadingView }; }
            }),
            new Route({
                url: '/profile',
                component: async () => await import('views/profile'),
                title: 'Профиль',
                name: 'profile'
            }),
            new Route({
                url: '/post/create',
                component: async () => await import('views/post/create'),
                title: 'Создание поста',
                name: 'post.create'
            }),

            new Route({
                url: '/post/*',
                component: async () => await import('views/post/view'),
                title: 'Просмотр поста',
                name: 'post.view'
            }),
            new Route({
                url: '/core/pathChildren',
                component: async () => await import('components/random-anim')
            }),
            new Route({
                url: '',
                component: async () => { return { default: ErrorPage }; },
                title: 'Страница не найдена'
            })
        ]} loadingView={
            !navigator.onLine
                ? <ErrorPage err="-1" desc="Нет соединения с интернетом" />
                : <LoadingView />
        } />
        , document.getElementById('root'));

    console.log(App);
});
