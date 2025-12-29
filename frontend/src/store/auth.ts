import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthTokens } from '@/types'
import { authApi, type LoginInput, type RegisterInput } from '@/lib/api'

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isLoading: boolean
  isAuthenticated: boolean
  rememberMe: boolean

  // Actions
  login: (data: LoginInput, rememberMe?: boolean) => Promise<void>
  register: (data: RegisterInput) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
  setUser: (user: User) => void
  setTokens: (tokens: AuthTokens) => void
  checkAuth: () => Promise<void>
}

// Helper pour le stockage
const getStorage = (rememberMe: boolean) => rememberMe ? localStorage : sessionStorage

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isLoading: true,
      isAuthenticated: false,
      rememberMe: true,

      login: async (data: LoginInput, rememberMe = true) => {
        const response = await authApi.login(data)

        if (response.success) {
          const { user, accessToken, refreshToken } = response.data
          const storage = getStorage(rememberMe)

          // Sauvegarder le token selon le choix de l'utilisateur
          storage.setItem('accessToken', accessToken)
          storage.setItem('refreshToken', refreshToken)
          
          // Nettoyer l'autre storage
          if (rememberMe) {
            sessionStorage.removeItem('accessToken')
            sessionStorage.removeItem('refreshToken')
          } else {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
          }

          set({
            user,
            tokens: { accessToken, refreshToken },
            isAuthenticated: true,
            isLoading: false,
            rememberMe,
          })
        }
      },

      register: async (data: RegisterInput) => {
        const response = await authApi.register(data)

        if (response.success) {
          const { user, accessToken, refreshToken } = response.data

          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)

          set({
            user,
            tokens: { accessToken, refreshToken },
            isAuthenticated: true,
            isLoading: false,
          })
        }
      },

      logout: async () => {
        try {
          await authApi.logout()
        } catch {
          // Ignorer les erreurs de logout
        } finally {
          // Nettoyer les deux storages
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          sessionStorage.removeItem('accessToken')
          sessionStorage.removeItem('refreshToken')

          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            rememberMe: true,
          })
        }
      },

      refreshAuth: async () => {
        const { tokens } = get()

        if (!tokens?.refreshToken) {
          set({ isLoading: false })
          return
        }

        try {
          const response = await authApi.refreshToken(tokens.refreshToken)

          if (response.success) {
            const { accessToken, refreshToken } = response.data

            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)

            set({
              tokens: { accessToken, refreshToken },
            })
          }
        } catch {
          // Token invalide, déconnecter
          await get().logout()
        }
      },

      checkAuth: async () => {
        // Vérifier les deux storages
        const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')

        if (!accessToken) {
          set({ isLoading: false, isAuthenticated: false })
          return
        }

        try {
          const response = await authApi.me()

          if (response.success) {
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
            })
          }
        } catch {
          // Token invalide, essayer de rafraîchir
          try {
            await get().refreshAuth()

            // Réessayer après rafraîchissement
            const response = await authApi.me()

            if (response.success) {
              set({
                user: response.data,
                isAuthenticated: true,
                isLoading: false,
              })
            }
          } catch {
            await get().logout()
          }
        }
      },

      setUser: (user: User) => set({ user }),

      setTokens: (tokens: AuthTokens) => {
        localStorage.setItem('accessToken', tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)
        set({ tokens })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)


