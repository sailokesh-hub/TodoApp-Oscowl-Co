import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class UserProfile extends Component {
  render() {
    const {match, history} = this.props
    if (Cookies.get('jwt_token') === undefined) {
      history.replace('/login')
    }
    console.log(match)
    return (
      <div>
        <div className="account-details-container">
          <div>
            <h1 className="account-heading">Account</h1>
            <br />
            <hr className="hr-line" />
            <div className="member-details-container">
              <h3>Member ship</h3>
              <div className="username-password">
                <p>rahul@gmail.com</p>
                <p>Password: *********</p>
              </div>
            </div>
            <hr className="hr-line" />
            <div className="plan-details-container">
              <h3>Plan Details</h3>
              <div className="plan-details">
                <p>Premium</p>
                <p>Ultra HD</p>
              </div>
            </div>
            <hr className="hr-line" />
          </div>
          <div className="logout-btn-container">
            <Link to="/login">
              <button
                type="button"
                className="logout-btn"
                onClick={() => Cookies.remove('jwt_token')}
              >
                Logout
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default UserProfile