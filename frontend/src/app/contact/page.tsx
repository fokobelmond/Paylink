'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Wallet, ArrowLeft, Mail, Clock, MapPin, Loader2, Send } from 'lucide-react'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Question générale',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    setIsSubmitting(true)
    
    // Ouvrir le client mail avec les informations pré-remplies
    const mailtoLink = `mailto:paylink.now@gmail.com?subject=${encodeURIComponent(`[PayLink] ${formData.subject} - ${formData.name}`)}&body=${encodeURIComponent(`Nom: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`
    
    window.location.href = mailtoLink
    
    toast.success('Redirection vers votre client mail...')
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">PayLink</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Contactez-nous</h1>
          <p className="text-lg text-slate-600">
            Notre équipe est disponible par email pour vous aider
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Infos de contact */}
          <div className="space-y-6">
            {/* Email - Seul moyen de contact */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Notre contact</h2>
              
              <a 
                href="mailto:paylink.now@gmail.com"
                className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
              >
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">Email</h3>
                  <p className="text-blue-600 font-medium">paylink.now@gmail.com</p>
                  <p className="text-sm text-slate-500 mt-1">Réponse sous 24-48h</p>
                </div>
              </a>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Délai de réponse</h3>
              </div>
              <p className="text-slate-600">
                Nous répondons généralement dans un délai de <strong>24 à 48 heures</strong> ouvrables.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Localisation</h3>
              </div>
              <p className="text-slate-600">
                Cameroun 🇨🇲<br />
                Service 100% en ligne
              </p>
            </div>

            {/* CTA Email direct */}
            <a 
              href="mailto:paylink.now@gmail.com"
              className="block w-full bg-blue-600 text-white py-4 rounded-xl font-medium hover:bg-blue-700 transition text-center"
            >
              <Mail className="w-5 h-5 inline-block mr-2" />
              Envoyer un email directement
            </a>
          </div>

          {/* Formulaire de contact */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Envoyez-nous un message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nom complet *
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Votre nom"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Votre email *
                </label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="vous@exemple.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sujet
                </label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option>Question générale</option>
                  <option>Problème technique</option>
                  <option>Paiement / Transaction</option>
                  <option>Partenariat</option>
                  <option>Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Message *
                </label>
                <textarea 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  placeholder="Décrivez votre demande..."
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Ouverture du client mail...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>

            <p className="text-sm text-slate-500 text-center mt-4">
              Ce formulaire ouvrira votre application mail
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
