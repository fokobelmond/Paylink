'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageTemplate } from '@/components/templates'
import { pagesApi } from '@/lib/api'
import type { Page, ApiError } from '@/types'

// Données de démo (fallback si le backend ne répond pas)
const demoPages: Record<string, Page> = {
  'marie-coiffure': {
    id: 'demo-page1',
    slug: 'marie-coiffure',
    userId: 'demo-user1',
    templateType: 'SERVICE_PROVIDER',
    status: 'PUBLISHED',
    title: 'Marie Coiffure',
    description: 'Coiffure et soins capillaires professionnels à Douala. Plus de 10 ans d\'expérience.',
    logoUrl: null,
    primaryColor: '#2563eb',
    templateData: {
      type: 'SERVICE_PROVIDER',
      profession: 'Coiffeuse professionnelle',
      location: 'Douala, Akwa',
      whatsapp: '237655123456',
    },
    viewCount: 234,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    publishedAt: '2024-01-15T12:00:00Z',
    services: [
      { id: 's1', pageId: 'demo-page1', name: 'Tresses simples', description: 'Tresses africaines classiques', pricingMode: 'NET_AMOUNT' as const, basePrice: 5000, displayPrice: 5200, netPrice: 5000, price: 5200, isActive: true, sortOrder: 0 },
      { id: 's2', pageId: 'demo-page1', name: 'Tissage complet', description: 'Tissage avec mèches incluses', pricingMode: 'NET_AMOUNT' as const, basePrice: 15000, displayPrice: 15600, netPrice: 15000, price: 15600, isActive: true, sortOrder: 1 },
      { id: 's3', pageId: 'demo-page1', name: 'Lissage brésilien', description: 'Lissage professionnel longue durée', pricingMode: 'NET_AMOUNT' as const, basePrice: 25000, displayPrice: 26000, netPrice: 25000, price: 26000, isActive: true, sortOrder: 2 },
      { id: 's4', pageId: 'demo-page1', name: 'Coupe + Coiffage', description: 'Coupe personnalisée avec mise en forme', pricingMode: 'NET_AMOUNT' as const, basePrice: 8000, displayPrice: 8300, netPrice: 8000, price: 8300, isActive: true, sortOrder: 3 },
    ],
  },
  'ong-espoir': {
    id: 'demo-page2', slug: 'ong-espoir', userId: 'demo-user2', templateType: 'DONATION', status: 'PUBLISHED',
    title: 'ONG Espoir Cameroun', description: 'Aidez-nous à construire des écoles dans les zones rurales du Cameroun.',
    logoUrl: null, primaryColor: '#dc2626',
    templateData: { type: 'DONATION', cause: 'Construction d\'écoles rurales', goal: 5000000, collected: 2350000, showProgress: true },
    viewCount: 567, createdAt: '2024-01-10T08:00:00Z', updatedAt: '2024-01-25T11:00:00Z', publishedAt: '2024-01-10T09:00:00Z', services: [],
  },
  'formation-excel': {
    id: 'demo-page3', slug: 'formation-excel', userId: 'demo-user1', templateType: 'TRAINING', status: 'PUBLISHED',
    title: 'Formation Excel Pro', description: 'Maîtrisez Excel de A à Z en 5 jours.',
    logoUrl: null, primaryColor: '#059669',
    templateData: { type: 'TRAINING', trainingName: 'Excel Pro - De débutant à expert', duration: '5 jours (30 heures)', startDate: '2024-02-15', format: 'hybrid', location: 'Yaoundé Centre' },
    viewCount: 128, createdAt: '2024-01-20T10:00:00Z', updatedAt: '2024-01-24T16:00:00Z', publishedAt: '2024-01-20T12:00:00Z',
    services: [
      { id: 't1', pageId: 'demo-page3', name: 'Formation complète', description: 'Accès à tous les modules + certificat', price: 75000, displayPrice: 78000, isActive: true, sortOrder: 0 },
    ],
  },
  'concert-makossa': {
    id: 'demo-page4', slug: 'concert-makossa', userId: 'demo-user3', templateType: 'EVENT', status: 'PUBLISHED',
    title: 'Concert Makossa Night', description: 'Une soirée exceptionnelle avec les plus grandes stars du Makossa camerounais.',
    logoUrl: null, primaryColor: '#7c3aed',
    templateData: { type: 'EVENT', eventName: 'Makossa Night 2024', date: '2024-03-15', time: '20h00 - 04h00', location: 'Palais des Sports, Yaoundé', capacity: 5000, ticketsSold: 3200 },
    viewCount: 892, createdAt: '2024-01-05T14:00:00Z', updatedAt: '2024-01-26T09:00:00Z', publishedAt: '2024-01-05T15:00:00Z',
    services: [
      { id: 'e1', pageId: 'demo-page4', name: 'Place Standard', description: 'Accès à la salle principale', price: 5000, displayPrice: 5200, isActive: true, sortOrder: 0 },
      { id: 'e2', pageId: 'demo-page4', name: 'Place VIP', description: 'Zone VIP + boisson offerte', price: 15000, displayPrice: 15600, isActive: true, sortOrder: 1 },
      { id: 'e3', pageId: 'demo-page4', name: 'Table VVIP (6 personnes)', description: 'Table réservée + bouteille + service', price: 100000, displayPrice: 104000, isActive: true, sortOrder: 2 },
    ],
  },
  'club-entrepreneurs': {
    id: 'demo-page5', slug: 'club-entrepreneurs', userId: 'demo-user4', templateType: 'ASSOCIATION', status: 'PUBLISHED',
    title: 'Club des Entrepreneurs du Cameroun', description: 'Rejoignez le premier réseau d\'entrepreneurs du Cameroun.',
    logoUrl: null, primaryColor: '#0891b2',
    templateData: { type: 'ASSOCIATION', associationName: 'Club des Entrepreneurs du Cameroun', membershipType: 'Adhésion annuelle', period: 'yearly' },
    viewCount: 456, createdAt: '2024-01-08T11:00:00Z', updatedAt: '2024-01-22T17:00:00Z', publishedAt: '2024-01-08T12:00:00Z',
    services: [
      { id: 'a1', pageId: 'demo-page5', name: 'Membre Standard', description: 'Accès aux événements mensuels', price: 25000, displayPrice: 26000, isActive: true, sortOrder: 0 },
      { id: 'a2', pageId: 'demo-page5', name: 'Membre Premium', description: 'Tous les avantages + mentorat personnalisé', price: 100000, displayPrice: 104000, isActive: true, sortOrder: 1 },
    ],
  },
  'vente-telephone': {
    id: 'demo-page6', slug: 'vente-telephone', userId: 'demo-user5', templateType: 'SIMPLE_SALE', status: 'PUBLISHED',
    title: 'iPhone 14 Pro Max', description: 'iPhone 14 Pro Max 256GB, neuf sous emballage. Garantie 1 an.',
    logoUrl: null, primaryColor: '#1f2937',
    templateData: { type: 'SIMPLE_SALE', productName: 'iPhone 14 Pro Max 256GB', whatsapp: '237600000000' },
    viewCount: 78, createdAt: '2024-01-23T09:00:00Z', updatedAt: '2024-01-23T09:00:00Z', publishedAt: '2024-01-23T10:00:00Z',
    services: [{ id: 'p1', pageId: 'demo-page6', name: 'iPhone 14 Pro Max 256GB', description: 'Neuf, scellé, garantie 1 an', price: 850000, displayPrice: 884000, isActive: true, sortOrder: 0 }],
  },
}

export default function PublicPageView() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [page, setPage] = useState<Page | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPage = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Essayer d'abord de charger depuis le backend
        const response = await pagesApi.getBySlug(slug)
        
        if (response.success && response.data) {
          setPage(response.data)
        } else {
          // Fallback sur les données de démo
          const demoPage = demoPages[slug]
          if (demoPage) {
            setPage(demoPage)
          } else {
            setError('Page non trouvée')
          }
        }
      } catch (err) {
        // En cas d'erreur réseau, utiliser les données de démo
        const apiError = err as ApiError
        console.log('Fallback to demo data:', apiError.message)
        
        const demoPage = demoPages[slug]
        if (demoPage) {
          setPage(demoPage)
        } else {
          setError('Page non trouvée')
        }
      }

      setIsLoading(false)
    }

    fetchPage()
  }, [slug])

  const handlePayment = async (serviceId?: string, amount?: number) => {
    setIsPaymentLoading(true)

    // Construire l'URL de paiement avec les paramètres
    const paymentParams = new URLSearchParams({
      pageId: page!.id,
      slug: page!.slug,
    })

    if (serviceId) {
      paymentParams.set('serviceId', serviceId)
    }

    if (amount) {
      paymentParams.set('amount', amount.toString())
    }

    // Rediriger vers la page de paiement
    router.push(`/pay?${paymentParams.toString()}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Page non trouvée
          </h1>
          <p className="text-slate-600 mb-6">
            Cette page n'existe pas ou a été supprimée.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    )
  }

  if (page.status !== 'PUBLISHED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">🚧</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Page en construction
          </h1>
          <p className="text-slate-600 mb-6">
            Cette page n'est pas encore disponible.
          </p>
        </div>
      </div>
    )
  }

  return (
    <PageTemplate
      page={page}
      onPayment={handlePayment}
      isLoading={isPaymentLoading}
    />
  )
}

