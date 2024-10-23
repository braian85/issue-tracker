import Sidebar from '@/components/sidebar/sidebar'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex h-screen bg-[#202020]'>
      <Sidebar />
      <main className='flex-1 p-8 bg-[#181818] text-[#EFE3E3]'>{children}</main>
    </div>
  )
}
