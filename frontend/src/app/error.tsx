'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Wallet, Home, RefreshCw, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log l'erreur dans la console (en prod, envoyer à un service comme Sentry)
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-slate-900">PayLink</span>
        </Link>

        {/* Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Oups, une erreur est survenue
        </h2>
        <p className="text-slate-600 mb-8">
          Nous sommes désolés, quelque chose s'est mal passé. 
          Veuillez réessayer ou contacter le support si le problème persiste.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => reset()}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Réessayer
          </Button>
          <Link href="/">
            <Button variant="secondary" leftIcon={<Home className="w-4 h-4" />}>
              Retour à l'accueil
            </Button>
          </Link>
        </div>

        {/* Error code */}
        {error.digest && (
          <p className="mt-6 text-xs text-slate-400">
            Code d'erreur : {error.digest}
          </p>
        )}

        {/* Links */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-4">Besoin d'aide ?</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/aide" className="text-primary-600 hover:underline">
              Centre d'aide
            </Link>
            <Link href="/contact" className="text-primary-600 hover:underline">
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

