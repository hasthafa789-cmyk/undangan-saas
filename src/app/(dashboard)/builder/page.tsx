'use client'

import { useState } from 'react'
import { useBuilderStore } from '@/store/useBuilderStore'
import { supabase } from '@/lib/supabase'

export default function BuilderPage() {
  const { groomName, brideName, eventDate, galleryImage, theme, setField } = useBuilderStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [publishedUrl, setPublishedUrl] = useState('')

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 10)}.${fileExt}`
    const filePath = `public/${fileName}`
    const { error: uploadError } = await supabase.storage.from('galleries').upload(filePath, file)

    if (uploadError) alert('Gagal mengunggah foto: ' + uploadError.message)
    else {
      const { data } = supabase.storage.from('galleries').getPublicUrl(filePath)
      setField('galleryImage', data.publicUrl)
    }
    setIsUploading(false)
  }

  const handleSave = async () => {
    if (!groomName || !brideName) return alert('Nama pengantin harus diisi!')
    setIsLoading(true)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setIsLoading(false)
      return alert("Anda harus login terlebih dahulu!")
    }

    const baseSlug = `${groomName}-dan-${brideName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`

    const { error } = await supabase.from('invitations').insert([
      {
        user_id: session.user.id,
        slug: uniqueSlug,
        groom_name: groomName,
        bride_name: brideName,
        event_date: eventDate || null,
        gallery_image: galleryImage,
        theme: theme, // <-- [BARU] Simpan tema ke database
      }
    ])

    setIsLoading(false)
    if (error) alert(`Gagal Menyimpan: ${error.message}`)
    else {
      setPublishedUrl(`/${uniqueSlug}`)
      alert('Berhasil! Undangan Anda sudah aktif.')
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* PANEL KIRI (Input) */}
      <div className="w-1/2 p-10 bg-white border-r overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Undangan</h1>
        
        <div className="space-y-6">
          {/* [BARU] OPSI PILIH TEMA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Tema Undangan</label>
            <div className="flex gap-4">
              <button 
                onClick={() => setField('theme', 'classic')}
                className={`flex-1 py-3 border-2 rounded-lg font-semibold transition ${theme === 'classic' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                🤍 Classic Light
              </button>
              <button 
                onClick={() => setField('theme', 'dark')}
                className={`flex-1 py-3 border-2 rounded-lg font-semibold transition ${theme === 'dark' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                🖤 Elegant Dark
              </button>
            </div>
          </div>

          <div className="border-t pb-2"></div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pria</label>
            <input type="text" value={groomName} onChange={(e) => setField('groomName', e.target.value)} className="w-full border p-3 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Wanita</label>
            <input type="text" value={brideName} onChange={(e) => setField('brideName', e.target.value)} className="w-full border p-3 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Acara</label>
            <input type="date" value={eventDate} onChange={(e) => setField('eventDate', e.target.value)} className="w-full border p-3 rounded" />
          </div>
          <div className="p-4 border border-dashed border-gray-400 rounded-lg bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Foto Cover</label>
            <input type="file" accept="image/*" onChange={handleUploadFoto} disabled={isUploading} className="text-sm" />
            {isUploading && <p className="text-sm text-blue-500 mt-2">Sedang mengunggah foto...</p>}
          </div>

          <button onClick={handleSave} disabled={isLoading || isUploading} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400">
            {isLoading ? 'Menyimpan...' : 'Simpan & Publish'}
          </button>

          {publishedUrl && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-green-800">
              <a href={publishedUrl} target="_blank" rel="noreferrer" className="font-bold underline">
                Buka Undangan ({publishedUrl})
              </a>
            </div>
          )}
        </div>
      </div>

      {/* PANEL KANAN (Live Preview yang berubah sesuai Tema) */}
      <div className="w-1/2 flex items-center justify-center bg-gray-200 relative">
        {/* Latar HP berubah tergantung tema */}
        <div className={`w-[375px] h-[667px] rounded-3xl shadow-2xl border-[8px] border-gray-800 overflow-hidden relative flex flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="h-64 w-full flex-shrink-0 bg-gray-200">
            {galleryImage ? (
              <img src={galleryImage} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm italic">Belum ada foto</div>
            )}
          </div>
          <div className="p-8 text-center flex-grow flex flex-col justify-center">
            {/* Teks berubah warna tergantung tema */}
            <p className={`text-sm tracking-widest mb-2 uppercase ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>The Wedding Of</p>
            <h2 className={`text-4xl font-serif ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{groomName}</h2>
            <span className={`text-2xl font-serif italic my-1 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>&</span>
            <h2 className={`text-4xl font-serif mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{brideName}</h2>
            <div className={`w-12 h-[1px] mx-auto mb-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {eventDate ? new Date(eventDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Pilih tanggal acara'}
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}