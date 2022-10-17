import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import {Button} from 'react-bootstrap'

const NavbarComp = () => {
  const { user, logout } = useAuth()
  const router = useRouter()

  return (
    <Navbar bg="light">
      <Container>
        <Link href="/" passHref>
          <Navbar.Brand>Resource Management</Navbar.Brand>
        </Link>
        <Navbar.Toggle/>
        <Navbar.Collapse>
          <Nav>
            {user ? (
              <div>
                <Nav.Link
                  onClick={() => {
                    logout()
                    router.push('/login')
                  }}
                >
                  Logout
                </Nav.Link>

                <Nav.Link>
                  Create Project
                </Nav.Link>
              </div>
            ) : (
              <>
                <Link href="/signup" passHref>
                  <Nav.Link>Signup</Nav.Link>
                </Link>
                <Link href="/login" passHref>
                  <Nav.Link>Login</Nav.Link>
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavbarComp