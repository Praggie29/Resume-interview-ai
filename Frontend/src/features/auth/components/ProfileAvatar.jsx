import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'
import './ProfileAvatar.scss'

const ProfileAvatar = () => {
    const { user, handleLogout } = useAuth()
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (!user) return null

    const firstLetter = user.username ? user.username.charAt(0).toUpperCase() : '?'

    const handleLogoutClick = async () => {
        setShowDropdown(false)
        await handleLogout()
        navigate('/login')
    }

    return (
        <div className="profile-avatar" ref={dropdownRef}>
            <div className="avatar-circle" onClick={() => setShowDropdown(!showDropdown)}>
                <span className="avatar-letter">{firstLetter}</span>
            </div>
            {showDropdown && (
                <div className="avatar-dropdown">
                    <div className="dropdown-header">
                        <span className="dropdown-username">{user.username}</span>
                        <span className="dropdown-email">{user.email}</span>
                    </div>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item dropdown-logout" onClick={handleLogoutClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfileAvatar