import '../styles/Auth.scss'

const AuthPage = () => {
    const description: string = `
        Into the shelter - it's discussion based game where\n
        you should prove other players that you should go to the shelter.\n
        Be careful, other people will do the same!\n
        Every discussion all the players should deside who should leave them\n
        and die beyound the shelter.\n\n

        Only half will survive!\n
        - or not :D
    `
    return (
        <div className="auth-page-container">
            <pre>
                {description}
            </pre>
        </div>
    )
}

export default AuthPage
