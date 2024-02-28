import '../styles/Settings.scss'

const SettingsPage = () => {
    const description: string = 'Settings page'

    
    return (
        <div className="settings-page">
            {/* <pre>
                {description}
            </pre> */}
            <div className='settings-page-container'>
                <div className='settings-page-block'>
                    <p className='settings-page-title'>User settings</p>
                    <p className='settings-page-text'>Change usename</p>

                    <div className='settings-page-form'>
                        <input className='settings-page-input' type='text' placeholder='my name'/>
                        <button className='settings-page-btn'>Change</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage
