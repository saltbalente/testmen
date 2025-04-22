import type { User } from "@/types/auth"
import { v4 as uuidv4 } from "uuid"

// Función para simular un hash de contraseña (en producción usaríamos bcrypt)
const hashPassword = (password: string): string => {
  // En una aplicación real, usaríamos bcrypt o argon2
  return btoa(password + "salt_secreto")
}

// Función para verificar contraseña
const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword
}

// Función para generar un token JWT simulado
const generateToken = (user: User): string => {
  // En una aplicación real, usaríamos un paquete JWT real
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 horas
  }
  return btoa(JSON.stringify(payload))
}

// Función para obtener usuarios del localStorage
const getUsers = (): Record<string, { user: User; password: string }> => {
  if (typeof window === "undefined") return {}

  const users = localStorage.getItem("vanguardista_users")
  return users ? JSON.parse(users) : {}
}

// Función para guardar usuarios en localStorage
const saveUsers = (users: Record<string, { user: User; password: string }>) => {
  if (typeof window === "undefined") return

  localStorage.setItem("vanguardista_users", JSON.stringify(users))
}

// Función de login
export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  // Simular latencia de red
  await new Promise((resolve) => setTimeout(resolve, 800))

  const users = getUsers()
  const userRecord = Object.values(users).find((record) => record.user.email === email)

  if (!userRecord) {
    throw new Error("Correo electrónico o contraseña incorrectos")
  }

  const isPasswordValid = verifyPassword(password, userRecord.password)

  if (!isPasswordValid) {
    throw new Error("Correo electrónico o contraseña incorrectos")
  }

  const token = generateToken(userRecord.user)

  return { user: userRecord.user, token }
}

// Función de registro
export const register = async (
  name: string,
  email: string,
  password: string,
): Promise<{ user: User; token: string }> => {
  // Simular latencia de red
  await new Promise((resolve) => setTimeout(resolve, 800))

  const users = getUsers()

  // Verificar si el correo ya está registrado
  const existingUser = Object.values(users).find((record) => record.user.email === email)

  if (existingUser) {
    throw new Error("Este correo electrónico ya está registrado")
  }

  // Crear nuevo usuario
  const newUser: User = {
    id: uuidv4(),
    email,
    name,
    role: "user",
    createdAt: new Date().toISOString(),
  }

  // Guardar usuario
  users[newUser.id] = {
    user: newUser,
    password: hashPassword(password),
  }

  saveUsers(users)

  const token = generateToken(newUser)

  return { user: newUser, token }
}

// Función de logout
export const logout = (): void => {
  // En una aplicación real, aquí invalidaríamos el token en el servidor
}

// Función para verificar token (simulada)
export const verifyToken = (token: string): User | null => {
  try {
    const decoded = JSON.parse(atob(token))

    // Verificar expiración
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    const users = getUsers()
    const userRecord = users[decoded.sub]

    if (!userRecord) {
      return null
    }

    return userRecord.user
  } catch (error) {
    return null
  }
}
