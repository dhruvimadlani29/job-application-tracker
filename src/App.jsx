// src/App.jsx
import AppCard from './components/AppCard';

// Temporary fake data so we can see the cards
// We will replace this with real database data in Week 3
const fakeApplications = [
  { id: 1, company: 'Shopify', role: 'Frontend Developer Co-op',
    status: 'Applied', dateApplied: 'Feb 22, 2026' },
  { id: 2, company: 'Klarna', role: 'Backend Developer Co-op',
    status: 'Interview', dateApplied: 'Mar 1, 2026' },
  { id: 3, company: 'TD Bank', role: 'Full Stack Developer Co-op',
    status: 'Applied', dateApplied: 'Feb 28, 2026' },
];

function App() {
  return (
    <div className='min-h-screen bg-gray-50 p-8'>

      {/* Header */}
      <h1 className='text-3xl font-bold text-gray-800 mb-2'>
        My Job Applications
      </h1>
      <p className='text-gray-400 mb-8'>Track your co-op journey</p>

      {/* Cards Grid */}
      <div className='flex flex-col gap-4'>
        {fakeApplications.map(app => (
          <AppCard key={app.id} application={app} />
        ))}
      </div>

    </div>
  );
}

export default App;
