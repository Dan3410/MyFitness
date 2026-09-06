import { FormEvent, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import MFButton from '../../components/mf-button/mf-button'
import MFFormField from '../../components/mf-form-field/mf-form-field'
import MFError from '../../components/mf-error/mf-error'
import { ComponentTheme } from '../../models/componentTheme'
import styles from './login.module.scss'

export default function Login() {
    const { session, login, register } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [registerMode, setRegisterMode] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)

    if (session) return <Navigate to="/" replace />

    const submit = async (event: FormEvent) => {
        event.preventDefault()
        setError('')
        if (!email.trim() || !password.trim()) {
            setError('El email y la contraseña son obligatorios')
            return
        }
        setBusy(true)
        try {
            if (registerMode) await register(email, password)
            else await login(email, password)
            const destination = (location.state as { from?: string } | null)?.from || '/'
            navigate(destination, { replace: true })
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'No se pudo completar la operación')
        } finally {
            setBusy(false)
        }
    }

    return (
        <main className={styles.page}>
            <section className={styles.panel}>
                <p className={styles.eyebrow}>MY FITNESS</p>
                <h1>{registerMode ? 'Crea tu espacio' : 'Volvé a entrenar'}</h1>
                <p className={styles.intro}>Tus datos de salud y tus rutinas, juntos y solo para vos.</p>
                <form onSubmit={submit} className={styles.form} noValidate>
                    <MFFormField theme={ComponentTheme.generic}>
                        <label>Email</label>
                        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                    </MFFormField>
                    <MFFormField theme={ComponentTheme.generic}>
                        <label>Contraseña</label>
                        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
                    </MFFormField>
                    <MFError hidden={!error}>{error}</MFError>
                    <MFButton type="submit" theme={ComponentTheme.generic} isDisabled={busy} width="100%">
                        <label>{busy ? 'Procesando...' : registerMode ? 'Crear cuenta' : 'Iniciar sesión'}</label>
                    </MFButton>
                </form>
                <MFButton type="button" theme={ComponentTheme.generic} onClickEvent={() => setRegisterMode(!registerMode)} width="100%">
                    <label>{registerMode ? 'Ya tengo una cuenta' : 'Crear una cuenta nueva'}</label>
                </MFButton>
            </section>
        </main>
    )
}
