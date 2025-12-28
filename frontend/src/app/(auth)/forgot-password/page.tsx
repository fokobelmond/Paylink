'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Wallet, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { authApi } from '@/lib/api'
import type { ApiError } from '@/types'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)

    try {
      await authApi.forgotPassword(data.email)
      setSubmittedEmail(data.email)
      setIsEmailSent(true)
      toast.success('Email envoyé !')
    } catch (error) {
      const apiError = error as ApiError
      // On affiche un message de succès même si l'email n'existe pas
      // pour éviter l'énumération des comptes
      setSubmittedEmail(data.email)
      setIsEmailSent(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Écran de confirmation
  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl text-slate-900">PayLink</span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Vérifiez votre email
            </h1>

            <p className="text-slate-600 mb-6">
              Si un compte existe avec l'adresse{' '}
              <strong className="text-slate-900">{submittedEmail}</strong>,
              vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700">
                📧 Vérifiez également votre dossier spam si vous ne voyez pas l'email.
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/login">
                <Button className="w-full">
                  Retour à la connexion
                </Button>
              </Link>

              <button
                onClick={() => {
                  setIsEmailSent(false)
                  setSubmittedEmail('')
                }}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Essayer avec une autre adresse
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500 mt-8">
            © {new Date().getFullYear()} PayLink. Tous droits réservés.
          </p>
        </motion.div>
      </div>
    )
  }

  // Formulaire
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-slate-900">PayLink</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Mot de passe oublié ?
            </h1>
            <p className="text-slate-600">
              Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="vous@exemple.com"
              leftIcon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Envoyer le lien de réinitialisation
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Vous vous souvenez de votre mot de passe ?{' '}
              <Link
                href="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-8">
          © {new Date().getFullYear()} PayLink. Tous droits réservés.
        </p>
      </motion.div>
    </div>
  )
}

