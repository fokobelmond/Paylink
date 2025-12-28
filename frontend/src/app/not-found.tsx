'use client'

import Link from 'next/link'
import { Wallet, Home, ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
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

        {/* 404 */}
        <div className="relative mb-8">
          <h1 className="text-[150px] font-bold text-slate-200 leading-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-20 h-20 text-slate-400" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Page introuvable
        </h2>
        <p className="text-slate-600 mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button leftIcon={<Home className="w-4 h-4" />}>
              Retour à l'accueil
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-slate-700 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Page précédente
          </button>
        </div>

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

