import React from 'react'
import { Form, Button, Alert, Container, Card } from 'react-bootstrap'
import StatusBar from '../components/StatusBar'
import Logo from '../components/Logo'

export default function LoginPage({ loginData, loginError, onChange, onGoogle, onSubmit, onBack }) {
  return (
    <main className="login-screen">
      <StatusBar />
      <Logo large />
      <Container className="d-flex justify-content-center">
        <Card className="p-4 w-100" style={{ maxWidth: 380, background: 'transparent', border: 'none' }}>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                aria-label="Email"
                isInvalid={loginError}
                placeholder="Email"
                type="email"
                value={loginData.email}
                onChange={(e) => onChange({ ...loginData, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                aria-label="Contraseña"
                placeholder="Contraseña"
                type="password"
                value={loginData.password}
                onChange={(e) => onChange({ ...loginData, password: e.target.value })}
              />
            </Form.Group>
            {loginError && (
              <Alert variant="danger" className="py-2 text-center" style={{ fontSize: '0.85rem' }}>
                El correo ingresado no corresponde a un inscripto.
              </Alert>
            )}
            <Button variant="link" className="p-0 mb-3 text-muted" style={{ fontSize: '0.85rem' }} type="button">
              ¿Olvidó su contraseña?
            </Button>
            <div className="d-flex gap-2 mb-2">
              <Button variant="primary" type="submit" className="flex-grow-1">
                Iniciar sesión
              </Button>
              <Button variant="outline-secondary" type="button" aria-label="Iniciar con Google" onClick={onGoogle} style={{ width: 44 }}>
                G
              </Button>
            </div>
            <Button variant="link" className="w-100 text-muted" type="button" onClick={onBack}>
              Volver
            </Button>
          </Form>
        </Card>
      </Container>
      <div className="brand-placeholder" aria-label="Logo placeholder" />
    </main>
  )
}
