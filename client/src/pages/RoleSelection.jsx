import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    // Navigate to registration with the selected role
    navigate(`/register?role=${role}`);
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <h1 className="auth-title">Welcome to CodeHub</h1>
            <p className="auth-subtitle">Choose how you want to join our community</p>
          </div>

          {/* Role Selection */}
          <div className="role-selector">
            {/* Student Role */}
            <button
              type="button"
              onClick={() => handleRoleSelect("student")}
              className="role-card"
              style={{ cursor: "pointer", border: "2px solid #e5e7eb" }}
            >
              <div className="role-icon">🎓</div>
              <h3 className="role-title">Student</h3>
              <p className="role-description">I'm currently studying in this college</p>
              <ul className="role-benefits">
                <li>Learn from industry professionals</li>
                <li>Get placement guidance</li>
                <li>Connect with alumni network</li>
                <li>Build your portfolio</li>
              </ul>
            </button>

            {/* Alumni Role */}
            <button
              type="button"
              onClick={() => handleRoleSelect("alumni")}
              className="role-card"
              style={{ cursor: "pointer", border: "2px solid #e5e7eb" }}
            >
              <div className="role-icon">👨‍💼</div>
              <h3 className="role-title">Alumni</h3>
              <p className="role-description">I've graduated from this college</p>
              <ul className="role-benefits">
                <li>Share your success story</li>
                <li>Mentor current students</li>
                <li>Stay connected with batch mates</li>
                <li>Contribute to the community</li>
              </ul>
            </button>
          </div>

          {/* Footer */}
          <div className="auth-footer">
            <p className="footer-text">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="link-primary"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="auth-sidebar">
          <div className="sidebar-content">
            <h2 className="sidebar-title">🚀 Build Your Network</h2>
            <p className="sidebar-text">
              Connect with alumni, share placement experiences, and grow together as a community.
            </p>
            <ul className="sidebar-features">
              <li>✓ Connect with professionals</li>
              <li>✓ Share success stories</li>
              <li>✓ Get mentorship</li>
              <li>✓ Find opportunities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
