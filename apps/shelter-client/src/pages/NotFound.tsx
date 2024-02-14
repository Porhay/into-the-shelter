import '../styles/NotFound.scss'

const NotFoundPage = () => {
    const description: string = 'Not Found'

    return (
        <div className="not-found-page-container">
            <pre>
                {description}
            </pre>
        </div>
    )
}

export default NotFoundPage
