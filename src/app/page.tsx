import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* NAVBAR */}
      <nav className="flex justify-between items-center p-6 lg:px-12 bg-white shadow-sm">
        <div className="text-2xl font-extrabold text-blue-600 tracking-tighter">
          Undang<span className="text-gray-800">Yuk.</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-600 hover:text-blue-600 font-semibold px-4 py-2">
            Masuk
          </Link>
          <Link href="/login" className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition">
            Daftar Gratis
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="flex-grow flex flex-col justify-center items-center text-center p-6 mt-10 lg:mt-0">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
            Buat Undangan Digital Premium dalam <span className="text-blue-600">5 Menit</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
            Sebarkan kabar bahagia Anda dengan cara yang modern, elegan, dan hemat. 
            Lengkap dengan fitur live-preview, konfirmasi kehadiran (RSVP), dan musik otomatis.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              Mulai Buat Sekarang &rarr;
            </Link>
            <Link href="#fitur" className="bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all">
              Lihat Contoh
            </Link>
          </div>
        </div>

        {/* MOCKUP IMAGE (Ilustrasi) */}
        <div className="mt-16 w-full max-w-4xl bg-white p-4 rounded-2xl shadow-2xl border border-gray-100">
          <div className="bg-gray-100 h-64 md:h-96 rounded-xl flex items-center justify-center text-gray-400 font-medium">
            (Di sini nanti Anda bisa menaruh foto screenshot aplikasi atau video undangan)
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center py-8 text-gray-500 text-sm mt-12 bg-white border-t border-gray-200">
        &copy; {new Date().getFullYear()} UndangYuk. All rights reserved.
      </footer>

    </div>
  )
}