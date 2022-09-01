import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'
import "../styles/components/Sidebar.module.css"


const SidebarComp = () => {
    const [navbarOpen, setNavbarOpen] = useState(false);
    const handleToggle = () => {
        setNavbarOpen(prev => !prev)
    }
    return (
        <nav className="navBar">
            <button onClick={handleToggle}>{navbarOpen ? "Close" : "Open"}</button>
            <ul className={`menuNav ${navbarOpen ? " showMenu" : ""}`}>
                <li><a className="navItem"></a></li>
            </ul>
        </nav>
    )
}

export default SidebarComp