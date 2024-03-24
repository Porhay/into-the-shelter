import '../styles/NotFound.scss';

const NotFoundPage = () => {
    const description = 'Not Found';

    return (
        <div className="not-found-page-container">
            <pre>{description}</pre>
        </div>
    );
};

export default NotFoundPage;
