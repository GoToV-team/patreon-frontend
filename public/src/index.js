import Router, { Route } from './router';
import Layout from './components/layout';
import LoadingView from './views/loading-view';
import user from './storage/user';

let router;
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await user.update();
    } catch {

    }
    const root = document.getElementById('root');

    router = new Router(root, [
        new Route('/main', async () => await import('views/main-page'), 'Главная страница'),
        new Route('/signin', async () => await import('views/signin'), 'Войти'),
        new Route('/signup', async () => await import('views/signup'), 'Регистрация'),
        new Route('/components', async () => await import('views/index'), 'Главная'),
        new Route('/creator/*', async () => await import('views/creator'), 'Страница автора'),
        new Route('/loading-view', async () => { return { default: LoadingView }; }, ''),
        new Route('/', async () => await import('views/profile'), 'Профиль'),
        new Route('', async () => await import('views/errorpage'), 'Страница не найдена')
    ]);

    router.setLayout(new Layout());
    router.setLoadingView(new LoadingView());
    router.start();
});

export { router };
