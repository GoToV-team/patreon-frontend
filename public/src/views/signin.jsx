import api from '../api/index';
import Component from '../components/basecomponent';
import Button from '../components/button';
import InputField from '../components/input-field';
import app from '../core/app';
import user from '../storage/user';
import ErrorPage from './errorpage';

class SigninView extends Component {
    constructor () {
        super();
        this.attributes.loading = false;
        this.attributes.error = false;

        this.form = [
            new InputField({
                placeholder: 'Эл. почта',
                type: 'email',
                validation: []
            }),
            new InputField({
                placeholder: 'Пароль',
                type: 'password',
                validation: []
            })
        ];
    }

    async submit (e) {
        e.preventDefault();

        const error = this.form.reduce(
            (status, form) => status || form.getValue() === '',
            false
        );
        if (error) return (this.attributes.error = 'Введите логин и пароль');
        this.attributes.error = '';
        this.attributes.loading = true;
        const res = await api.login({
            email: this.form[0].getValue(),
            password: this.form[1].getValue()
        });
        if (res.error) {
            this.attributes.loading = false;
            this.attributes.error = 'Неправильный логин и/или пароль';
        }
        user.update();
        this.attributes.loading = false;
    }

    render () {
        if (!navigator.onLine) {
            return <ErrorPage desc="Нет соединения с интернетом" />;
        }
        return (
            <div className="auth-block">
                <h1> Вход </h1>
                <form
                    className="auth-card shadow"
                    onSubmit={(e) => {
                        this.submit(e);
                    }}
                >
                    {this.form.map((c) => c.renderReactive())}
                    <div className="error">{this.attributes.error}</div>

                    <Button
                        text="Войти"
                        color="primary"
                        rounded={true}
                        loading={this.attributes.loading}
                        onClick={(e) => {
                            this.submit(e);
                        }}
                    />
                </form>
                <span className="auth-card__tooltip">
                    Впервые на Patreon?{' '}
                    <a href="#" router-go={app.$router.createUrl('signup')}>
                        Зарегистрируйтесь
                    </a>
                </span>
            </div>
        );
    }

    created () {
        if (user.user) return app.$router.go(app.$router.createUrl('profile'));

        this.form = [
            new InputField({
                placeholder: 'Эл. почта',
                type: 'email',
                validation: []
            }),
            new InputField({
                placeholder: 'Пароль',
                type: 'password',
                validation: []
            })
        ];
    }
}

export default SigninView;
