'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Fungsi untuk mendaftar akun baru
  const handleSignUp = async () => {
    if (!email || !password) return alert('Email dan password harus diisi')
    setIsLoading(true)
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert('Gagal daftar: ' + error.message)
    } else {
      alert('Berhasil daftar! Silakan masuk.')
    }
    setIsLoading(false)
  }

  // Fungsi untuk masuk ke akun
  const handleSignIn = async () => {
    if (!email || !password) return alert('Email dan password harus diisi')
    setIsLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert('Gagal masuk: ' + error.message)
    } else {
      // Jika berhasil, arahkan ke dashboard
      router.push('/dashboard') 
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Masuk ke Akun Anda
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Atau daftar jika belum punya akun
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
              >
                Masuk
              </button>
              <button
                onClick={handleSignUp}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-200"
              >
                Daftar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}