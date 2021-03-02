import PropTypes from 'prop-types'


const Header = ({ title }) => {
    return (
        <header>
            <h1 style={headerStyle}>{title}</h1>
            {/* <h1>{title}</h1> */}
        </header>
    )
}

Header.defaultProps = {
    title: 'Analytics Dashboard',
}

Header.propTypes = {
    title: PropTypes.string,
}

// CSS in JS
const headerStyle = {
    color: 'white',
    backgroundColor: 'black',
}


export default Header
