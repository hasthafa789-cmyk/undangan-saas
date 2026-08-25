'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

// Efek Animasi Dasar (Muncul perlahan dari bawah)
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

export default function InvitationClient({ invitation }: { invitation: any }) {
  const [isOpened, setIsOpened] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  // State untuk Buku Tamu
  const [guestName, setGuestName] = useState('')
  const [attendance, setAttendance] = useState('hadir')
  const [message, setMessage] = useState('')
  const [guestbook, setGuestbook] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mengambil data ucapan saat undangan dibuka
  useEffect(() => {
    const fetchGuestbook = async () => {
      const { data } = await supabase
        .from('guests_rsvp')
        .select('*')
        .eq('invitation_id', invitation.id)
        .order('created_at', { ascending: false })
      
      if (data) setGuestbook(data)
    }
    fetchGuestbook()
  }, [invitation.id])

  const handleOpen = () => {
    setIsOpened(true)
    if (audioRef.current) audioRef.current.play()
  }

  // Fungsi Kirim Ucapan
  const submitRSVP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestName || !message) return alert('Nama dan ucapan harus diisi!')
    
    setIsSubmitting(true)
    const { error } = await supabase.from('guests_rsvp').insert([
      { invitation_id: invitation.id, guest_name: guestName, attendance_status: attendance, message: message }
    ])

    if (!error) {
      alert('Terima kasih atas ucapan & doanya!')
      // Tambahkan langsung ke daftar layar tanpa refresh
      setGuestbook([{ guest_name: guestName, attendance_status: attendance, message: message, created_at: new Date() }, ...guestbook])
      setGuestName('')
      setMessage('')
    } else {
      alert('Gagal mengirim: ' + error.message)
    }
    setIsSubmitting(false)
  }

  return (
    <>
      <audio ref={audioRef} loop>
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
      </audio>

      {/* --- COVER DEPAN --- */}
      {!isOpened && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 text-white">
          <div className="absolute inset-0 bg-black opacity-60"></div> 
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }} className="relative z-10 text-center flex flex-col items-center p-6">
            <p className="text-sm tracking-widest mb-4 uppercase text-gray-300">The Wedding Of</p>
            <h1 className="text-5xl font-serif mb-8">{invitation.groom_name} & {invitation.bride_name}</h1>
            <p className="mb-6 text-gray-300 text-sm">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <p className="mb-10 font-semibold text-lg border-b border-white pb-1">Tamu Undangan</p>
            <button onClick={handleOpen} className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-pulse">
              Buka Undangan
            </button>
          </motion.div>
        </div>
      )}

      {/* --- ISI UNDANGAN (Muncul setelah dibuka) --- */}
      <main className={`bg-stone-50 transition-opacity duration-1000 ${isOpened ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        
        {/* BAGIAN 1: HEADER (Nama & Tanggal) */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center p-6">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-md w-full bg-white p-10 rounded-t-[5rem] shadow-xl border border-stone-100">
            <p className="text-sm tracking-widest text-stone-500 mb-6 uppercase font-semibold">You are invited</p>
            <h1 className="text-6xl font-serif text-stone-800 mb-4">{invitation.groom_name}</h1>
            <span className="text-4xl font-serif italic text-stone-300 block mb-4">&</span>
            <h1 className="text-6xl font-serif text-stone-800 mb-8">{invitation.bride_name}</h1>
            <div className="w-16 h-[1px] bg-stone-300 mx-auto mb-8"></div>
            <p className="text-xl text-stone-600">
              {invitation.event_date || 'Menyusul'}
            </p>
          </motion.div>
        </section>

        {/* BAGIAN 2: GALERI FOTO */}
        <section className="py-20 px-6 bg-white">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-md mx-auto text-center">
            <h2 className="text-3xl font-serif text-stone-800 mb-2">Our Gallery</h2>
            <p className="text-stone-500 mb-8">Momen bahagia kami</p>
            
            {/* Grid 4 Foto (Menggunakan foto dummy pemandangan romantis) */}
            <div className="grid grid-cols-2 gap-3">
              <img src="https://picsum.photos/400/500?random=1" className="rounded-xl object-cover w-full h-48 shadow-sm" alt="Gallery 1" />
              <img src="https://picsum.photos/400/500?random=2" className="rounded-xl object-cover w-full h-48 shadow-sm mt-6" alt="Gallery 2" />
              <img src="https://picsum.photos/400/500?random=3" className="rounded-xl object-cover w-full h-48 shadow-sm -mt-6" alt="Gallery 3" />
              <img src="https://picsum.photos/400/500?random=4" className="rounded-xl object-cover w-full h-48 shadow-sm" alt="Gallery 4" />
            </div>
          </motion.div>
        </section>

        {/* BAGIAN 3: RSVP & BUKU TAMU */}
        <section className="py-20 px-6 bg-stone-100">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-200">
              <h2 className="text-2xl font-serif text-stone-800 mb-6 text-center">RSVP & Ucapan</h2>
              
              {/* Form Input */}
              <form onSubmit={submitRSVP} className="space-y-4 mb-10">
                <input type="text" placeholder="Nama Anda" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full border border-stone-300 p-3 rounded-lg bg-stone-50 outline-none focus:border-stone-500" required />
                
                <select value={attendance} onChange={(e) => setAttendance(e.target.value)} className="w-full border border-stone-300 p-3 rounded-lg bg-stone-50 outline-none focus:border-stone-500">
                  <option value="hadir">Hadir</option>
                  <option value="tidak_hadir">Maaf, Tidak Bisa Hadir</option>
                  <option value="ragu">Masih Ragu</option>
                </select>

                <textarea placeholder="Tulis ucapan & doa..." value={message} onChange={(e) => setMessage(e.target.value)} className="w-full border border-stone-300 p-3 rounded-lg bg-stone-50 outline-none focus:border-stone-500 h-24" required></textarea>

                <button type="submit" disabled={isSubmitting} className="w-full bg-stone-800 text-white font-bold py-3 rounded-lg hover:bg-stone-900 transition">
                  {isSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}
                </button>
              </form>

              {/* Daftar Ucapan (Scrollable) */}
              <div className="h-64 overflow-y-auto pr-2 space-y-4">
                {guestbook.length === 0 ? (
                  <p className="text-center text-stone-400 text-sm">Belum ada ucapan. Jadilah yang pertama!</p>
                ) : (
                  guestbook.map((guest, index) => (
                    <div key={index} className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-stone-800">{guest.guest_name}</span>
                        <span className="text-xs px-2 py-1 rounded bg-stone-200 text-stone-600">
                          {guest.attendance_status === 'hadir' ? 'Hadir' : guest.attendance_status === 'ragu' ? 'Ragu' : 'Tidak Hadir'}
                        </span>
                      </div>
                      <p className="text-stone-600 text-sm">{guest.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
          {/* ... (kode bagian Buku Tamu sebelumnya) ... */}
        </section>

        {/* --- [BARU] WATERMARK BELUM LUNAS --- */}
        {!invitation.is_paid && (
          <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white text-center py-2 text-sm font-bold z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.2)]">
            Dibuat dengan NamaBrandAnda - Mode Trial (Belum Aktif)
          </div>
        )}

      </main>
    </>
  )
}