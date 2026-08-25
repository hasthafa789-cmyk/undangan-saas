'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

// Menggunakan tipe "any" dan "await props.params" untuk Next.js terbaru
export default function TrackerPage(props: any) {
  const [invitation, setInvitation] = useState<any>(null)
  const [guests, setGuests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTrackerData = async () => {
      const params = await props.params;
      const id = params.id;

      // 1. Ambil data undangan (untuk judul)
      const { data: invData } = await supabase.from('invitations').select('*').eq('id', id).single()
      if (invData) setInvitation(invData)

      // 2. Ambil data tamu yang mengisi RSVP untuk undangan ini
      const { data: guestData } = await supabase
        .from('guests_rsvp')
        .select('*')
        .eq('invitation_id', id)
        .order('created_at', { ascending: false })
      
      if (guestData) setGuests(guestData)
      setIsLoading(false)
    }

    fetchTrackerData()
  }, [props.params])

  if (isLoading) return <div className="p-10 text-center font-semibold text-gray-600">Memuat data tamu...</div>
  if (!invitation) return <div className="p-10 text-center text-red-500 font-bold">Data tidak ditemukan.</div>

  // Menghitung statistik kehadiran
  const totalHadir = guests.filter(g => g.attendance_status === 'hadir').length
  const totalTidakHadir = guests.filter(g => g.attendance_status === 'tidak_hadir').length
  const totalRagu = guests.filter(g => g.attendance_status === 'ragu').length

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Tombol Kembali & Judul */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-blue-600 hover:underline text-sm font-semibold mb-2 inline-block">
              &larr; Kembali ke Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Buku Tamu: {invitation.groom_name} & {invitation.bride_name}</h1>
          </div>
          <a href={`/${invitation.slug}`} target="_blank" rel="noreferrer" className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 shadow-sm">
            Lihat Undangan
          </a>
        </div>

        {/* KOTAK STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <p className="text-gray-500 text-sm font-semibold mb-1">Total Tamu (Isi Form)</p>
            <p className="text-4xl font-bold text-blue-600">{guests.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <p className="text-gray-500 text-sm font-semibold mb-1">Akan Hadir</p>
            <p className="text-4xl font-bold text-emerald-500">{totalHadir}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <p className="text-gray-500 text-sm font-semibold mb-1">Tidak Hadir</p>
            <p className="text-4xl font-bold text-red-500">{totalTidakHadir}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <p className="text-gray-500 text-sm font-semibold mb-1">Masih Ragu</p>
            <p className="text-4xl font-bold text-orange-400">{totalRagu}</p>
          </div>
        </div>

        {/* TABEL DAFTAR TAMU */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">Daftar Ucapan & Doa</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b">
                  <th className="p-4 font-semibold text-gray-600 text-sm">Nama Tamu</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Status Kehadiran</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Ucapan & Doa</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Waktu Mengisi</th>
                </tr>
              </thead>
              <tbody>
                {guests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">Belum ada tamu yang mengisi buku tamu.</td>
                  </tr>
                ) : (
                  guests.map((guest) => (
                    <tr key={guest.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4 font-bold text-gray-800">{guest.guest_name}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          guest.attendance_status === 'hadir' ? 'bg-emerald-100 text-emerald-700' :
                          guest.attendance_status === 'tidak_hadir' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {guest.attendance_status === 'hadir' ? 'Hadir' : guest.attendance_status === 'tidak_hadir' ? 'Tidak Hadir' : 'Ragu-Ragu'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 text-sm max-w-xs">{guest.message}</td>
                      <td className="p-4 text-gray-500 text-xs">
                        {new Date(guest.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}