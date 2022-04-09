

function WelcomeScreen(props) {

    const onClickToStart = () => {
        props.setIsReady(true);
    }
    return (
        <div className="welcome-panel" onClick={onClickToStart}>
            <div className="center-panel">
                <span className="click-to-start" >Click to Start!!!</span>
            </div>
        </div>
    )
}

export default WelcomeScreen;