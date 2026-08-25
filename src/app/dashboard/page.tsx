'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardIndex() {
  const [user, setUser] = useState<any>(null)
  const [invitations, setInvitations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // NOMOR WA ADMIN (GANTI DENGAN NOMOR ANDA)
  const adminWhatsApp = "6285129927486" 

  const fetchDashboardData = async () => {
    setIsLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) return router.push('/login')

    setUser(session.user)
    const { data } = await supabase.from('invitations').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
    if (data) setInvitations(data)
    setIsLoading(false)
  }

  useEffect(() => { fetchDashboardData() }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (isLoading) return <div className="p-10 text-center font-bold text-gray-500">Memuat dashboard...</div>

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Anda</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 font-medium">{user?.email}</span>
            <button onClick={handleLogout} className="text-red-500 text-sm font-bold hover:underline">Keluar</button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Undangan Saya</h2>
            <div className="flex gap-2">
              <button onClick={fetchDashboardData} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 text-sm font-semibold">🔄 Refresh</button>
              <Link href="/builder" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-semibold shadow-sm">+ Buat Baru</Link>
            </div>
          </div>

          {invitations.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">Anda belum memiliki undangan.</p>
              <Link href="/builder" className="text-blue-600 font-bold hover:underline">Mulai Buat Undangan &rarr;</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {invitations.map((inv) => {
                // Teks otomatis untuk dikirim ke WA Anda
                const waMessage = encodeURIComponent(`Halo Admin, saya ingin mengaktifkan undangan digital untuk ${inv.groom_name} & ${inv.bride_name} (Link: localhost:3000/${inv.slug}). Mohon info cara pembayarannya.`)

                return (
                  <div key={inv.id} className="border border-gray-200 p-5 rounded-lg bg-gray-50 hover:bg-white transition-colors">
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-lg text-gray-800">{inv.groom_name} & {inv.bride_name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Link URL: <a href={`/${inv.slug}`} target="_blank" rel="noreferrer" className="text-blue-500 font-medium hover:underline">/{inv.slug}</a>
                        </p>
                      </div>
                      <Link href={`/tracker/${inv.id}`} className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-md text-sm font-bold hover:bg-emerald-200 shadow-sm transition-all">
                        👁️ Lihat Tamu
                      </Link>
                    </div>

                    {/* --- [BARU] STATUS PEMBAYARAN & TOMBOL WA --- */}
                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${inv.is_paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {inv.is_paid ? '✅ Lunas & Aktif' : '⚠️ Belum Lunas (Trial)'}
                      </span>
                      
                      {!inv.is_paid && (
                        <a 
                          href={`https://api.whatsapp.com/send?phone=${adminWhatsApp}&text=${waMessage}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-green-600 transition-all flex items-center gap-2"
                        >
                          💬 Aktifkan Undangan (WA)
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}