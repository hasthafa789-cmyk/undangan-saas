import { supabase } from '@/lib/supabase'
import InvitationClient from '@/components/InvitationClient'

// [BARU] Baris Ajaib: Memaksa Next.js selalu mengambil data terbaru, dilarang pakai Cache!
export const dynamic = 'force-dynamic'

export default async function InvitationPage(props: any) {
  const params = await props.params;
  const slug = params.slug;

  const { data: invitation, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', slug)
    .single()

  // Jika error atau data benar-benar tidak ada
  if (error || !invitation) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-red-500 font-bold p-10 text-center">
        Data undangan tidak ditemukan. <br/>
        (Pastikan URL benar atau undangan belum dihapus)
      </div>
    )
  }

  return <InvitationClient invitation={invitation} />
}