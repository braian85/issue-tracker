import IssueTrackerLogo from '@/components/logo/issueTrackerLogo'

export default function Home() {
  return (
    <div className='grid grid-rows-[auto_1fr_auto] min-h-screen px-8 pb-20 gap-16 sm:px-20 sm:pt-5 sm:pb-20 font-[family-name:var(--font-geist-sans)]'>
      <header className='flex justify-between items-center'>
        <IssueTrackerLogo />
        <nav>
          <a href='#features' className='mr-4 hover:underline'>
            Features
          </a>
          <a href='#pricing' className='mr-4 hover:underline'>
            Pricing
          </a>
          <a href='#contact' className='hover:underline'>
            Contact
          </a>
        </nav>
      </header>

      <main className='flex flex-col gap-8 items-center text-center'>
        <h1 className='text-4xl font-bold mb-4'>
          Track Issues Fast and Efficiently
        </h1>
        <p className='text-xl mb-8'>
          Prioritize, visualize, and resolve issues with ease using our powerful
          Issue Tracker app.
        </p>

        <div className='flex gap-4 items-center flex-col sm:flex-row'>
          <a
            className='rounded-full bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition-colors'
            href='#signup'
          >
            Get Started
          </a>
          <a
            className='rounded-full border border-solid border-gray-300 px-6 py-3 hover:bg-gray-100 transition-colors'
            href='#demo'
          >
            Watch Demo
          </a>
        </div>

        <div
          id='features'
          className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-16'
        >
          <div className='p-6 border rounded-lg'>
            <h3 className='text-xl font-semibold mb-2'>Priority Management</h3>
            <p>
              Easily set and adjust issue priorities to focus on what matters
              most.
            </p>
          </div>
          <div className='p-6 border rounded-lg'>
            <h3 className='text-xl font-semibold mb-2'>Traffic Light System</h3>
            <p>
              Visualize issue status at a glance with our intuitive traffic
              light indicators.
            </p>
          </div>
          <div className='p-6 border rounded-lg'>
            <h3 className='text-xl font-semibold mb-2'>Checklists</h3>
            <p>
              Break down complex issues into manageable tasks with built-in
              checklists.
            </p>
          </div>
          <div className='p-6 border rounded-lg'>
            <h3 className='text-xl font-semibold mb-2'>Highlights</h3>
            <p>
              Emphasize critical information and key updates within each issue.
            </p>
          </div>
          <div className='p-6 border rounded-lg'>
            <h3 className='text-xl font-semibold mb-2'>Real-time Updates</h3>
            <p>
              Stay informed with instant notifications and live issue tracking.
            </p>
          </div>
          <div className='p-6 border rounded-lg'>
            <h3 className='text-xl font-semibold mb-2'>
              Customizable Workflows
            </h3>
            <p>
              Tailor the app to fit your team&apos;s unique issue management
              process.
            </p>
          </div>
        </div>
      </main>

      <footer className='flex gap-6 flex-wrap items-center justify-center mt-16'>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='#about'
        >
          About Us
        </a>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='#privacy'
        >
          Privacy Policy
        </a>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='#terms'
        >
          Terms of Service
        </a>
      </footer>
    </div>
  )
}
