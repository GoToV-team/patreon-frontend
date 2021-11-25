import { nextTick } from '../../modules/jsx/utils';
import Component from '../basecomponent';
import Button from '../button';
import FileUploader from '../file-uploader';
import ImageUploader from '../image-uploader';
import './style.scss';

/**
 * Компонент карточки создателя
 */
class EditorComponent extends Component {
    constructor ({
        isDraft = true,
        title = '',
        description = '',
        comment = '',
        levels = [],
        activeLevel = 0,
        cover = null,
        body = [],
        onSave = (post) => { },
        onDelete = () => { },
        onLoadCover = () => { },
        onLoadImage = () => { },
        onLoadFile = () => { }
    } = {}) {
        super();
        this.attributes.title = title;
        this.attributes.description = description;
        this.attributes.levels = levels;
        this.attributes.activeLevel = activeLevel;
        this.attributes.cover = cover;
        this.attributes.comment = comment;
        this.attributes.body = body;
        this.attributes.isDraft = isDraft;

        this.attributes.onSave = onSave;
        this.attributes.onDelete = onDelete;
        this.attributes.onLoadCover = onLoadCover;
        this.attributes.onLoadImage = onLoadImage;
        this.attributes.onLoadFile = onLoadFile;

        this.attributes.body.forEach(b => {
            if (!b.hash) {
                b.hash = this.newHash();
            }
        });

        this.attributes.loadingCover = false;

        this.checkLast();
    }

    setLevel (id) {
        this.attributes.activeLevel = id;
    }

    fixText (text) {
        return text?.replace(/\n/g, '')?.replace(/\r/g, '');
    }

    editTitle (e) {
        this.attributes.title = this.fixText(e.target.innerText);
    }

    editDescription (e) {
        this.attributes.description = this.fixText(e.target.innerText);
    }

    findBody (hash) {
        return this.attributes.body.findIndex(el => el.hash === hash);
    }

    editTextBody (e, hash) {
        this.attributes.body[this.findBody(hash)].value = this.fixText(e.target.textContent) || '';
        this.checkLast();
    }

    convertToImage (hash) {
        return this.convertTo(hash, 'image');
    }

    convertTo (hash, type) {
        this.attributes.body[this.findBody(hash)].type = type;
        this.checkLast();
    }

    async loadImage (hash, image) {
        const element = this.attributes.body[this.findBody(hash)];
        element.loading = true;
        this.update();

        const res = await this.attributes.onLoadImage(image);

        element.id = res.id;
        element.value = URL.createObjectURL(image);

        element.loading = false;
        this.update();
    }

    async loadFile (hash, file, type) {
        const element = this.attributes.body[this.findBody(hash)];
        element.loading = true;
        element.error = false;
        this.update();

        const res = await this.attributes.onLoadFile(file, type);
        if (res.id) {
            element.id = res.id;
            element.value = URL.createObjectURL(file);
        } else {
            element.error = res.error;
        }

        element.loading = false;
        this.update();
    }

    checkLast () {
        if (
            this.attributes.body.length === 0 ||
            this.attributes.body.at(-1).type !== 'text' ||
            this.attributes.body.at(-1).value !== ''
        ) {
            this.appendBody();
        }
    }

    appendBody () {
        this.attributes.body.push(this.newTextBody());
    }

    newHash () {
        return String((new Date()).getTime()) + String(Math.random());
    }

    newTextBody () {
        return {
            hash: this.newHash(),
            value: '',
            type: 'text'
        };
    }

    keyPress (event, hash = null) {
        // console.log(event, hash)
        if (hash !== null && (event.keyCode === 8 || event.keyCode === 46)) {
            const i = this.findBody(hash);
            if (this.attributes.body[i].value === '') {
                this.attributes.body.splice(i, 1);
                this.checkLast();
                event.preventDefault();
                this.updatePartly();
                if (event.keyCode === 8) {
                    this.focusBodyElement(Math.max(0, i - 1), true);
                }
            }
            return;
        }

        if (event.keyCode === 13) {
            if (hash != null) {
                const i = this.findBody(hash);
                this.attributes.body.splice(i + 1, 0, this.newTextBody());
                this.updatePartly();

                this.focusBodyElement(i + 1);
            }

            event.preventDefault();
            return;
        }

        if (event.keyCode !== 32) {
            this.update();
        }
    }

    async focusBodyElement (i, atEnd = false) {
        await nextTick();
        const element = this.vdom.dom.querySelectorAll('.editor__body-element')[i];
        element.focus();
        if (atEnd) {
            const range = document.createRange();
            range.selectNodeContents(element);
            range.collapse(false);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    save () {
        this.attributes.onSave({
            title: this.attributes.title,
            description: this.attributes.description,
            levelId: this.attributes.activeLevel,
            body: Object.assign(this.attributes.body.filter(b => b.value))
        });
    }

    delete () {
        this.attributes.onDelete({
            title: this.attributes.title,
            description: this.attributes.description,
            levelId: this.attributes.activeLevel,
            body: Object.assign(this.attributes.body.filter(b => b.value))
        });
    }

    render () {
        return (
            <div className="editor">
                <div className="editor__header">
                    <div className="editor__helper editor__helper-title">
                        Заголовок
                    </div>

                    <div
                        className={['editor__title', this.attributes.title ? '' : 'editor_show-placeholder']}
                        contentEditable
                        onInput={(e) => {
                            this.editTitle(e);
                        }}
                        onKeyPress={(e) => {
                            this.keyPress(e);
                        }}
                        onPaste={(e) => this.onPaste(e, (a) => { this.attributes.title = a; })}
                        placeholder="Введите заголовок"
                    >
                        {this.attributes.title}
                    </div>

                    <div className="editor__helper">
                        Уровень
                    </div>

                    <div className="editor__levels">
                        <div
                            className={[
                                'editor__level',
                                this.attributes.activeLevel === 0 ? 'active' : ''
                            ]}
                            onClick={() => {
                                this.setLevel(0);
                            }}
                        >
                            Доступен всем
                        </div>

                        {this.attributes.levels.map((level) => {
                            return (
                                <>
                                    {' | '}

                                    <div
                                        className={[
                                            'editor__level',
                                            level.id === this.attributes.activeLevel ? 'active' : ''
                                        ]}
                                        onClick={() => {
                                            this.setLevel(level.id);
                                        }}
                                    >
                                        {level.title}
                                    </div>
                                </>
                            );
                        })}
                    </div>

                    <div className="editor__helper">
                        Описание
                    </div>

                    <div
                        className={['editor__description', this.attributes.description ? '' : 'editor_show-placeholder']}
                        contentEditable
                        onInput={(e) => {
                            this.editDescription(e);
                        }}
                        onKeyPress={(e) => {
                            this.keyPress(e);
                        }}
                        placeholder="Введите описание"
                    >
                        {this.attributes.description}
                    </div>
                </div>

                <div className="editor__save-panel">
                    {this.attributes.isDraft
                        ? <div className="btn-container">
                            <Button
                                color="success"
                                onClick={
                                    () => { this.save(); }
                                }
                                text="Продолжить"
                            />
                        </div>
                        : <>
                            <div className="btn-container">
                                <Button
                                    color="success"
                                    onClick={
                                        () => { this.save(); }
                                    }
                                    text="Сохранить"
                                />
                            </div>

                            <div className="btn-container">
                                <Button
                                    color="primary"
                                    onClick={
                                        () => { this.delete(); }
                                    }
                                    text="Удалить"
                                />
                            </div>

                        </>}

                    {this.attributes.comment}
                </div>

                {!this.attributes.isDraft
                    ? <>
                        <ImageUploader
                            image={this.attributes.cover}
                            imageName="обложку"
                            isCircle={false}
                            loading={this.attributes.loadingCover}
                            onChange={async (image) => {
                                this.attributes.loadingCover = true;
                                this.attributes.cover = await this.attributes.onLoadCover(image);
                                this.attributes.loadingCover = false;
                            }}
                        />

                        {this.attributes.body.map((element) => {
                            return (
                                <>
                                    {element.type === 'text' && !element.value
                                        ? (
                                            <div
                                                className="editor__helper editor__helper--body"
                                                key={element.hash + '_helper'}
                                            >
                                                <button
                                                    alt="Добавить музыку"
                                                    className="add-icon-button"
                                                    onClick={
                                                        () => { this.convertTo(element.hash, 'audio'); }
                                                    }
                                                >
                                                    <div
                                                        className="icon"
                                                        style="--icon: url('/imgs/icons/music_outline_24.svg')"
                                                    />
                                                </button>

                                                <button
                                                    alt="Добавить картинку"
                                                    className="add-icon-button"
                                                    onClick={
                                                        () => { this.convertToImage(element.hash); }
                                                    }
                                                >
                                                    <div
                                                        className="icon"
                                                        style="--icon: url('/imgs/icons/picture_outline_28.svg')"
                                                    />
                                                </button>

                                                <button
                                                    alt="Добавить видео"
                                                    className="add-icon-button"
                                                    onClick={
                                                        () => { this.convertTo(element.hash, 'video'); }
                                                    }
                                                >
                                                    <div
                                                        className="icon"
                                                        style="--icon: url('/imgs/icons/video_outline_24.svg')"
                                                    />
                                                </button>
                                            </div>
                                        )
                                        : (
                                            ''
                                        )}

                                    {element.type === 'text'
                                        ? (
                                            <div
                                                className={['editor__body-element', element.value === '' ? 'editor__body-element_show-placeholder' : '']}
                                                contentEditable
                                                key={element.hash + '_element'}
                                                onInput={(e) => {
                                                    this.editTextBody(e, element.hash);
                                                }}
                                                onKeyDown={(e) => {
                                                    this.keyPress(e, element.hash);
                                                }}
                                                placeholder="Пишите текст вашей статьи здесь или выберите  нужный элемент слева"
                                            >
                                                {element.value}
                                            </div>
                                        )
                                        : null}

                                    {element.type === 'image'
                                        ? (
                                            <ImageUploader
                                                image={element.value}
                                                isCircle={false}
                                                onChange={(image) => {
                                                    this.loadImage(element.hash, image);
                                                }}
                                                loading={element.loading}
                                            />
                                        )
                                        : null}

                                    {element.type === 'audio'
                                        ? (
                                            <div>
                                                Аудио:
                                                <FileUploader
                                                    accept=".ogg"
                                                    onChange={(image) => {
                                                        this.loadFile(element.hash, image, element.type);
                                                    }}
                                                    loading={element.loading}
                                                />

                                                {element.error ? 'Ошибка загрузки:' + element.error : ''}

                                                {element.value
                                                    ? <audio controls>
                                                        <source src={element.value} />
                                                    </audio>
                                                    : null}

                                            </div>
                                        )
                                        : null}

                                    {
                                        element.type === 'video'
                                            ? (
                                                <div>
                                                    Видео
                                                    <FileUploader
                                                        accept=".3gpp, .mp4"
                                                        onChange={(image) => {
                                                            this.loadFile(element.hash, image, element.type);
                                                        }}
                                                        loading={element.loading}
                                                    />

                                                    {element.error ? 'Ошибка загрузки:' + element.error : ''}

                                                    {element.value
                                                        ? <video controls>
                                                            <source src={element.value} />
                                                        </video>
                                                        : null}

                                                </div>
                                            )
                                            : null
                                    }
                                </>
                            );
                        })}
                    </>
                    : ''}

            </div>
        );
    }
}

export default EditorComponent;
