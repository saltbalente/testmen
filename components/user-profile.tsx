"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export default function UserProfile() {
  const [user, setUser] = useState(null)
  const signOut = () => {
    // Función vacía por ahora
    console.log("Sign out clicked")
  }
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.user_metadata?.name || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase.from("profiles").update({ name }).eq("id", user?.id)

      if (error) throw error

      const { error: authError } = await supabase.auth.updateUser({
        data: { name },
      })

      if (authError) throw authError

      setSuccess("Perfil actualizado correctamente")
      setIsEditing(false)
    } catch (err: any) {
      setError(err.message || "Error al actualizar el perfil")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  const userInitials = user.user_metadata?.name
    ? user.user_metadata.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.substring(0, 2).toUpperCase() || "U"

  return (
    <Card className="backdrop-blur-md bg-black/30 border-purple-500/20 text-white w-full max-w-md">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-purple-500/50">
          <AvatarImage src={user.user_metadata?.avatar_url || ""} />
          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-500">{userInitials}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{user.user_metadata?.name || "Usuario"}</CardTitle>
          <CardDescription className="text-purple-300">{user.email}</CardDescription>
        </div>
      </CardHeader>

      <Separator className="bg-purple-500/20" />

      <CardContent className="pt-6">
        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-black/30 border-purple-500/30"
              />
            </div>

            {error && <div className="text-red-400 text-sm p-2 bg-red-900/20 rounded">{error}</div>}

            {success && <div className="text-green-400 text-sm p-2 bg-green-900/20 rounded">{success}</div>}

            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : "Guardar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-purple-500/30 text-white"
              >
                Cancelar
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-purple-300">Email</h3>
              <p>{user.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-purple-300">Miembro desde</h3>
              <p>{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
            <Button onClick={() => setIsEditing(true)} variant="outline" className="border-purple-500/30 text-white">
              Editar perfil
            </Button>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button onClick={signOut} variant="destructive" className="w-full bg-red-600 hover:bg-red-700">
          Cerrar sesión
        </Button>
      </CardFooter>
    </Card>
  )
}
